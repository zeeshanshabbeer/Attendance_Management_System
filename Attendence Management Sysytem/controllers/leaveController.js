const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const LeaveRequest=require("../models/requestLeaveModel")
const Leave=require("../models/leaveModel")

//student request for leave
exports.leaverequest=catchAsync(async(req,res,next)=>{
    const {leave_type,leave_to,leave_from,leave_description}=req.body
    const user=req.user
    const {user_id}=user
    const record=await LeaveRequest.findOne({
        leave_user_id:user_id
    })
    if(!record){
        const leave=new LeaveRequest({
            leave_user_id:user_id,
            leave_type,
            leave_to,
            leave_from,
            leave_description
        })
        await leave.save();
        res.status(200).json({
            status:"success",
            message:leave
          })
        
    }else{
        return next(
            new AppError("your request for leave is already pending",
            400)
          )
    }        
})
//Admin add leave request of student
exports.Admin_leaverequest=catchAsync(async(req,res,next)=>{
    const {leave_type,leave_to,leave_from,leave_description}=req.body
    const {user_id}=req.params
    const record=await LeaveRequest.findOne({
        leave_user_id:user_id
    })
    if(!record){
        const leave=new LeaveRequest({
            leave_user_id:user_id,
            leave_type,
            leave_to,
            leave_from,
            leave_description
        })
        await leave.save();
        res.status(200).json({
            status:"success",
            message:leave
          })
        
    }else{
        return next(
            new AppError("your request for leave is already pending",
            400)
          )
    }        
})
// Admin view all leave requests
exports.view_leaveRequest=catchAsync(async(req,res,next)=>{
    const record=await LeaveRequest.find();
    if(!record){
        return next(
            new AppError("Their is no leave request",
            400)
          )
    }else{
        res.status(200).json({
            status:"success",
            message:record
          })
    }
})
// admin accept leave request
exports.Accept_leaveRequest=catchAsync(async(req,res,next)=>{
    const {user_id}=req.params
    const record=await LeaveRequest.findOne({leave_user_id:user_id})
    if(!record){
        return next(
            new AppError("their is no leave request found",
            400)
          )
    }else{
        const leave=new Leave({
            leave_user_id:user_id,
            leave_type:record.leave_type,
            leave_to:record.leave_to,
            leave_from:record.leave_from,
            leave_description:record.leave_description,
        })
       await leave.save();
       await record.delete();
       res.status(200).json({
        status:"success",
        message:leave
      })
    }
})
exports.Reject_leaveRequest=catchAsync(async(req,res,next)=>{
    const {user_id}=req.params
    const record=await LeaveRequest.findOne({leave_user_id:user_id})
    if(!record){
        return next(
            new AppError("their is no leave request found",
            400)
          )
    }else{
        await record.delete()
        res.status(200).json({
                  status:"success",
                  message:"Record deleted successfully"
                })
    }
}) 
exports.Accept_Reject_leaveRequest=catchAsync(async(req,res,next)=>{
    const {user_id}=req.params
    const {status}=req.body
    const record=await LeaveRequest.findOne({leave_user_id:user_id})
    if(!record){
        return next(
            new AppError("their is no leave request found",
            400)
          )
    }else{
        if(status==="Accept"){
            const leave=new Leave({
                leave_user_id:user_id,
                leave_type:record.leave_type,
                leave_to:record.leave_to,
                leave_from:record.leave_from,
                leave_description:record.leave_description,
            })
           await leave.save();
           res.status(200).json({
            status:"success",
            message:leave
          })
        }else{
            await record.delete()
            res.status(200).json({
                status:"success",
                message:"Record deleted"
              })
        }
        
    }
})
//admin view leaves reports
exports.view_leave=catchAsync(async(req,res,next)=>{
    const record=await Leave.find();
    if(!record){
        return next(
            new AppError("Their is no leave request",
            400)
          )
    }else{
        res.status(200).json({
            status:"success",
            message:record
          })
    }
})
//Student view his/her leaves
exports.Student_view_leave=catchAsync(async(req,res,next)=>{
    const {user_id}=req.user
    const record=await Leave.findOne({
        leave_user_id:user_id
    });
    if(!record){
        return next(
            new AppError("Their is no leave request",
            400)
          )
    }else{
        res.status(200).json({
            status:"success",
            message:record
          })
    }
})
//delete leaves --admin--
exports.deleteLeave=catchAsync(async(req,res,next)=>{
    const {user_id}=req.params
    const record= await Leave.findOne({
        user_id
    })
    if(!record){
        return next(
            new AppError("Their is no leave record found",
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
