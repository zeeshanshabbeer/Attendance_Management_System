const express=require("express");
const { restart } = require("nodemon");
const router=express.Router();
const authController=require("../controllers/authController")
const leaveController=require("../controllers/leaveController")

//Student request for leaves
router.post("/Student_Leave_Request",authController.protect,authController.restrict("Admin","Teacher"), leaveController.leaverequest)
//admin add request for leave
router.post("/Admin_add_Student_Leave_Request/:user_id",authController.protect,authController.restrict("Student","Teacher"), leaveController.Admin_leaverequest)
//view leaves requests
router.get("/View_Leave_Requests",authController.protect,authController.restrict("Student","Teacher"), leaveController.view_leaveRequest)
//admin accept leave requests
router.post("/Accept_Request/:user_id",authController.protect,authController.restrict("Student","Teacher"), leaveController.Accept_leaveRequest)
//reject leave request
router.delete("/Reject_Request/:user_id",authController.protect,authController.restrict("Student","Teacher"),leaveController.Reject_leaveRequest)
//accept delete request
router.post("/Accept_Reject_Request/:user_id",authController.protect,authController.restrict("Student","Teacher"),leaveController.Accept_Reject_leaveRequest)
//admin view leaves
router.get("/Admin_View_leaves",authController.protect,authController.restrict("Student","Teacher"), leaveController.view_leave)
//Student view his /her leaves
router.get("/Student_View_Leaves",authController.protect,authController.restrict("Admin","Teacher"), leaveController.Student_view_leave )
//admin delete leaves
router.delete("/Delete_Leaves/:user_id",authController.protect,authController.restrict("Student","Teacher"),leaveController.deleteLeave)


module.exports=router;