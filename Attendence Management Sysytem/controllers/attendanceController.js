const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const Attendance=require("../models/attendanceModel")
const RequestAttendance=require("../models/requestAttendanceModel")
const User = require("../models/userModel")

//create attendance model for student 
exports.Attendence=catchAsync(async(req,res,next)=>{
    const {attendance_Teacher_id,attendance_student_id}=req.body
    const record=await Attendance.findOne({attendance_Teacher_id,attendance_student_id})
    if(!record){
        const isFound=await User.findOne({user_id:attendance_Teacher_id})
        if(!isFound){
            return next(
                new AppError("this teacher id not registered",
                400)
              ) 
        }else{
            const isfind=await User.findOne({user_id:attendance_student_id})
            if(!isfind){
                return next(
                    new AppError("this student id not registered",
                    400)
                  ) 
            }else{
                const attendance=new Attendance({
                    attendance_Teacher_id,
                    attendance_student_id
                })
                await attendance.save();
                res.status(200).json({
                    status:"success",
                    message:attendance
                  })
            }
        }
    
    }else{
        return next(
            new AppError("This student Already registered for attendance",
            400)
          )
    }

})
//student request for attendance
exports.requestAttendance=catchAsync(async(req,res,next)=>{
    const {attendance_type,attendance_description}=req.body
    const {user_id}=req.user
    const attendance=await Attendance.findOne({                   //student id
        attendance_student_id:user_id
    })
    if(!attendance){
        return next(
            new AppError("you don not allow to request for attendance",
            400)
          ) 
    }else{
        const record= await RequestAttendance.findOne({attendance_student_id:user_id})
        if(!record){
            const requestattendance=new RequestAttendance({
                attendance_student_id:user_id,
                attendance_Teacher_id:attendance.attendance_Teacher_id,
                attendance_type,
                attendance_description,
            })
            await requestattendance.save()
            res.status(200).json({
                status:"success",
                message:requestattendance
              })
        }else{
            return next(
                new AppError("Your request already send ... please wait to approve your request",
                400)
              ) 
        }
    }
}) 
//teacher view student requests
exports.viewAttendanceRequest=catchAsync(async(req,res,next)=>{
    const user=req.user
    const {user_id}=user
    // console.log(user_id)
    const attendance=await RequestAttendance.findOne({attendance_Teacher_id:user_id})
    if(!attendance){
        return next(
            new AppError("No class registered for attendance with your id",
            400)
          )
    }else{
        res.status(200).json({
            status:"success",
            message:attendance
          })
    }
})
//Admin view student requests
exports.viewAttend_Request=catchAsync(async(req,res,next)=>{
    // console.log(user_id)
    const attendance=await RequestAttendance.find();
    if(!attendance){
        return next(
            new AppError("No class registered for attendance with your id",
            400)
          )
    }else{
        res.status(200).json({
            status:"success",
            message:attendance
          })
    }
})
//teacher or admin view specific student request
exports.view_Specific_Student_Request=catchAsync(async(req,res,next)=>{
    const {attendance_student_id}=req.params
    const attendance=await RequestAttendance.find({attendance_student_id})
    if(!attendance){
        return next(
            new AppError("No request available",
            400)
          )
    }else{
        res.status(200).json({
            status:"success",
            message:attendance
          })
    }
})
//teacher accept reject student request
exports.Accept_Reject_Student_Request=catchAsync(async(req,res,next)=>{
    const {attendance_student_id,status}=req.params
    const attendance=await RequestAttendance.findOne({attendance_student_id})
    if(!attendance){
        return next(
            new AppError("No request found",
            400)
          )
    }else{
        const record= await Attendance.findOne({
            attendance_student_id:attendance.attendance_student_id,
            attendance_Teacher_id:attendance.attendance_Teacher_id,
        })
        if(status==="Accept"){
            attendance_type=attendance.attendance_type
            attendance_description=attendance.attendance_description
            await record.add(attendance_type,attendance_description)
            await record.save();
            await attendance.delete();
            res.status(200).json({
                status:"success",
                message:record
              })
        }else if(status==="Reject"){
            if(attendance.attendance_type==="Present"){
                attendance_type="Absent"
                attendance_description=attendance.attendance_description
                await record.add(attendance_type,attendance_description)
                await record.save();
                await attendance.delete();
                res.status(200).json({
                    status:"success",
                    message:record
                  })
            }else{
                attendance_type=attendance.attendance_type
                attendance_description=attendance.attendance_description
                await record.add(attendance_type,attendance_description)
                await record.save();
                await attendance.delete();
                res.status(200).json({
                    status:"success",
                    message:record
                  })
            }
        }else{
            return next(
                new AppError("Your request do not accept",
                400)
              ) 
        }
            
    }
})
//Teacher accept student request
exports.Accept_Student_Request=catchAsync(async(req,res,next)=>{
    const {attendance_student_id}=req.params
    const attendance=await RequestAttendance.findOne({attendance_student_id})
    if(!attendance){
        return next(
            new AppError("No request found",
            400)
          )
    }else{
        const record= await Attendance.findOne({
            attendance_student_id:attendance.attendance_student_id,
            attendance_Teacher_id:attendance.attendance_Teacher_id,
        })
            attendance_type=attendance.attendance_type
            attendance_description=attendance.attendance_description
            await record.add(attendance_type,attendance_description)
            await record.save();
            await attendance.delete();
            res.status(200).json({
                status:"success",
                message:record
              })
    }
})
//teacher reject student request
exports.Reject_Student_Request=catchAsync(async(req,res,next)=>{
    const {attendance_student_id}=req.params
    const attendance=await RequestAttendance.findOne({attendance_student_id})
    if(!attendance){
        return next(
            new AppError("No request found",
            400)
          )
    }else{
        const record= await Attendance.findOne({
            attendance_student_id:attendance.attendance_student_id,
            attendance_Teacher_id:attendance.attendance_Teacher_id,
        })
        if(attendance.attendance_type==="Present"){
            attendance_type="Absent"
            attendance_description=attendance.attendance_description
            await record.add(attendance_type,attendance_description)
            await record.save();
            await attendance.delete()
            res.status(200).json({
                status:"success",
                message:record
              })
        }else{
            attendance_type=attendance.attendance_type
            attendance_description=attendance.attendance_description
            await record.add(attendance_type,attendance_description)
            await attendance.delete();
            await record.save();
            res.status(200).json({
                status:"success",
                message:record
              })
        }

    }
})
//student view attendance 
exports.viewAttendance=catchAsync(async(req,res,next)=>{
    const user=req.user
    const {user_id}=user
    const record=await Attendance.findOne({
        attendance_student_id:user_id
    })
    if(!record){
        return next(
            new AppError("no attendance record found",
            400)
          )
    }else{
        res.status(200).json({
            status:"success",
            message:record
          })
    }
})
// admin view attendance
exports.Admin_viewAttendance=catchAsync(async(req,res,next)=>{
    const record=await Attendance.find();
    if(!record){
        return next(
            new AppError("no record found",
            400)
          )        
    }else{
        res.status(200).json({
            status:"success",
            message:record
          })
    }
})
//admin view specific student attendance
exports.Admin_view_SpecificStudent_Attendance=catchAsync(async(req,res,next)=>{
    const {attendance_student_id}=req.params
    const record=await Attendance.findOne({attendance_student_id})
    if(!record){
        return next(
            new AppError("no record found",
            400)
          )
    }else{
        res.status(200).json({
            status:"success",
            message:record
          })
    }
})
//change attendance by admin
exports.changeattendance=catchAsync(async(req,res,next)=>{
    const {user_id}=req.params;
    const {attendance_type,date}=req.body
    const record=await Attendance.findOne({attendance_student_id :user_id})
    if(!record){
        return next(
            new AppError("no attendance record found",
            400)
          )
    }else{
        for(i=0;i<record.request.length;i++){
            if(record.request[i].date===date){
                record.request[i].attendance_type=attendance_type
                await record.save();
                res.status(200).json({
                    status:"success",
                    message:"Change successfully.."
                  })
            }
        }       
    }
})
