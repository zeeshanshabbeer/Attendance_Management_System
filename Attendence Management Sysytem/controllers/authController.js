const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync=require("../utils/catchAsync")
const AppError=require("../utils/appError")
const bcrypt=require("bcryptjs")

//create the token
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h"
    });
  };
//send the token
  const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
  
    res.cookie('jwtToken', token, {
      expires: new Date(
        Date.now() + 3600000    //1 hour
      ),
      httpOnly: true,
    });
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };
  //authentication
  exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwtToken) {
      token = req.cookies.jwtToken;
    }
  
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
  
    // 2) Verification token
    const decoded = await jwt.verify(token,process.env.JWT_SECRET_KEY );
  
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  });
  //registered the user
  exports.registration=catchAsync(async (req,res,next)=>{
        const {user_id,user_name,role_name,user_email,role_description,user_address,user_username,user_password,user_contactNo}=req.body
        const userExist = await User.findOne({ user_email });
        if (userExist) {
          return next(
            new AppError(
              "User already exit & create account with another gmail",
              400
            )
          );
        }else{
            const user_record=new User({
                user_id,
                user_name,
                role_name,
                user_email,
                role_description,
                user_address,
                user_username,
                user_password,
                user_contactNo
            });
            console.log(user_record)
            await user_record.save();
            res.status(200).json({
              status:"success",
              message:user_record
            })
          }
})
//login
exports.login=catchAsync(async(req,res,next)=>{
  const {user_username,user_password,role_name}=req.body
  const userExit=await User.findOne({user_username})
  if(userExit){
    const matchpassword=await userExit.matchPassword(user_password)
    if(!matchpassword){
      return next(
        new AppError(
          "please enter correct username and passwords",
          400
        )
      );
    }else{
      if(userExit.role_name===role_name){
        createSendToken(userExit,201,req,res);
        res.status(200).json({
         status: "success",
           message: "Login Successful!.."
        })
      }else{
        return next(
          new AppError(
            "please enter correct username,role_name and password",
            400
          )
        );
  
      }
  
  }

  }else{
    return next(
      new AppError(
        "please enter correct username ,password and role_name",
        400
      )
    );
      }    
})
//restrict users
exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!!roles.includes(req.user.role_name)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
//profile
exports.profile=catchAsync(async(req,res,next)=>{
    const user=req.user;
    const {user_email}=user
    const student=await User.findOne({user_email})
    if(!student){
      return next(
        new AppError("No record found",
        400)
      )
    }else{
      res.status(200).json({
        status:"success",
        message:student
      })
    }
})
//update password
exports.updatePassword=catchAsync(async(req,res,next)=>{
  const {old_password,new_password,confirm_password}=req.body
  const user=req.user
  const {user_email}=user
  const student=await User.findOne({user_email})
  if(!student){
    return next(
      new AppError("No record found",
      400)
    )
  }else{
    const isMatch=await bcrypt.compare(old_password,student.user_password)
    if(!isMatch){
      return next(
       new AppError("your old password is incorrect",
        400)
      )
    }else{
      const new_isMatch=await bcrypt.compare(new_password,student.user_password)
      if(!new_isMatch){
        if(new_password===confirm_password){
        student.user_password=new_password
        await student.save();
        res.status(200).json({
          status:"success",
          message:"password update successful..."
        })
        }else{
          return next(
            new AppError("new and confirm password is not same",
            400)
          )
        }
      }else{
        return next(
          new AppError("your new password is same as old password",
          400)
        )
      }
    }
  }
})
//update contactNo
exports.updateContactNo=catchAsync(async(req,res,next)=>{
  const {contactNo}=req.body
  const  user=req.user
    user.user_contactNo=contactNo;
    await user.save();
    res.status(200).json({
      status:"success",
      message:user
    })
})
//logout
exports.logout=catchAsync(async(req,res,next)=>{
  res.clearCookie("jwtToken", { path: "/" });
  res.status(200).json({
    status:"success",
    message:"user Logout Successful.."
  });
})
