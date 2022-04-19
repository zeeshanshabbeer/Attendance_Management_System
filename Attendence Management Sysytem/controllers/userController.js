const User=require("../models/userModel")
const catchAsync = require("../utils/catchAsync")
const sendEmail=require("../utils/sendEmail")
const bcrypt=require("bcryptjs")
const crypto=require("crypto")
const AppError = require("../utils/appError")

//reset password
exports.resetPassword=catchAsync(async(req,res,next)=>{
    const {new_password,confirm_password}=req.body
    const token=req.body.token;
    // console.log(token)
        if(!new_password || !confirm_password){
          return next(
            new AppError("please filled the fields",
            400)
          )
        }else{
          const student=await User.findOne({
            resetToken:token,
          expireToken:{$gt:Date.now()}
        })
          if(!student){ 
            return next(
              new AppError("Token not verified",
              400)
            )  
          }else{
            // const isMatch=await student.matchPassword(new_password,student.user_password)
            // console.log(new_password)
            // console.log(student.user_password)
            const isMatch=await student.matchPassword(new_password)
            // console.log(`isMatch === ${isMatch}`)
            if(isMatch){
              return next(
                new AppError("old password is same as new password...please try another password",
                400)
              ) 
            }
            else{
              if(new_password===confirm_password){
                student.user_password=new_password
                student.resetToken=undefined;
                student.expireToken=undefined;
                await student.save()
                res.status(200).json({
                  status:"success",
                  message:"Reset Password Successfully"
                })
              }else{
                return next(
                  new AppError("New and confirm  password do not match",
                  400)
                ) 
              }
            }
          }
        }
          })              
//reset password link
exports.resetLink=catchAsync(async(req,res,next)=>{
  const {user_email}=req.body;
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      return next(
        new AppError(err,
        400)
      )
    } else {
      const token = buffer.toString("hex");
      const student = await User.findOne({ user_email });
      if(!student){
        return next(
          new AppError("no user registered with this email",
          400)
        )
      }else{
        student.resetToken=token;
        student.expireToken=Date.now()+360000;
        await student.save()
        const to=user_email;
        const from="z6680362@gmail.com"
        // const cc="z6680362@gmail.com"
        const subject="Reset Password Link"
        const html=`
        <h2>Attendence Management System</h2>
        <h3>${student.user_name}</h3>
        <h3>Reset Password</h3>
        <button>
        <a href="http://localhost:7000/ResetPassword/${token}">
        RESET YOUR PASSWORD
      </button>
        `
        try {
        await sendEmail(to,  from, subject, html);
        res.status(200).json({
          status:"success",
          message:"Email Send Successfully"
        })
        } catch (error) {
          return next(
            new AppError(error,
            400)
          )
        }

      }
    }
  })
})
         
//teacher view profile of student
exports.viewProfile=catchAsync(async(req,res,next)=>{
  const role_name="Student"
  const profile=await User.find({role_name})
  if(!profile){
      return next(
          new AppError("no profile found",
          400)
        ) 
  }else{
    res.status(200).json({
      status:"success",
      message:profile
    })
  }
})
//teacher view specific student profile or search student 
exports.view_Specific_Profile=catchAsync(async(req,res,next)=>{
  const {user_id}=req.params
  // const {user_id}=req.params
  const profile=await User.findOne({user_id})
  if(!profile){
      return next(
          new AppError("no profile found",
          400)
        ) 
  }else{
    res.status(200).json({
      status:"success",
      message:profile
    })
  }
})
//Admin view  profiles
exports.Admin_viewProfile=catchAsync(async(req,res,next)=>{
  const profile=await User.find()
  if(!profile){
      return next(
          new AppError("no profile found",
          400)
        ) 
  }else{
    res.status(200).json({
      status:"success",
      message:profile
    })
  }
})
//admin view specific student and teacher profile
exports.Admin_view_Specific_Profile=catchAsync(async(req,res,next)=>{
  const {user_id}=req.params
  // const {user_id}=req.params
  const profile=await User.findOne({user_id})
  if(!profile){
      return next(
          new AppError("no profile found",
          400)
        ) 
  }else{
    res.status(200).json({
      status:"success",
      message:profile
    })
  }
})