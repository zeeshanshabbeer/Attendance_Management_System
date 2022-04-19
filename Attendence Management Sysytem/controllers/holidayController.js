const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const Holiday=require("../models/holidayModel")
 
//admin add holiday
exports.addHoliday=catchAsync(async(req,res,next)=>{
    const {holiday_employee_id,holiday_date,holiday_duration,holiday_description}=req.body
    const record=await Holiday.findOne({holiday_employee_id})
    if(!record){
        const holiday=new Holiday({
            holiday_employee_id,
            holiday_date,
            holiday_duration,
            holiday_description
        })
        await holiday.save()
        res.status(200).json({
            status:"success",
            message:holiday
          })
    }else{
        return next(
            new AppError("Already holiday added",
            400)
          )
    }
})
//admin,strudent,teacher view
exports.viewHoliday=catchAsync(async(req,res,next)=>{
    const user=req.user
    const {role_name,user_id}=user
    if(role_name==="Admin"){
        const record=await Holiday.find()
        if(!record){
            return next(
                new AppError("their is no record available",
                400)
              ) 
        }else{
            res.status(200).json({
                status:"success",
                message:record
              })
        }
    }else if(role_name==="Student" || role_name==="Teacher"){
        const record=await Holiday.findOne({
            holiday_employee_id:user_id
        })
        if(!record){
            return next(
                new AppError("their is no record available",
                400)
              )
        }else{
            res.status(200).json({
                status:"success",
                message:record
              })
        }
    }else{
        return next(
            new AppError("You are not registered",
            400)
          )
    }

})
// admin delete holiday
exports.deleteHoliday=catchAsync(async(req,res,next)=>{
 const {holiday_employee_id}=req.params
 const record=await Holiday.findOne({
     holiday_employee_id
 })
 if(!record){
    return next(
        new AppError("No holiday found",
        400)
      )
 }else{
     await record.delete();
     res.status(200).json({
        status:"success",
        message:"Record Deleted"
      })
 }
})
// admin edit holiday 
exports.editHoliday=catchAsync(async(req,res,next)=>{
    const {holiday_employee_id,holiday_date,holiday_description,holiday_duration}=req.body
    const record=await Holiday.findOne({
        holiday_employee_id
    })
    if(!record){
       return next(
           new AppError("No result found for edit",
           400)
         )
    }else{
        record.holiday_date=holiday_date
        record.holiday_description=holiday_description
        record.holiday_duration=holiday_duration
        await record.save()
        res.status(200).json({
            status:"success",
            message:record
          })
    }
})
