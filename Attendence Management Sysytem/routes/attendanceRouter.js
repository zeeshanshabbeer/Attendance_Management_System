const express=require("express");
const router=express.Router();
const authController=require("../controllers/authController")
const attendenceController=require("../controllers/attendanceController")

//admin enroll the student for attendance
router.post("/Attendence",authController.protect, authController.restrict("Student","Teacher"),attendenceController.Attendence)
//student request for attendance
router.post("/Request_Attendanceance",authController.protect,authController.restrict("Admin","Teacher"), attendenceController.requestAttendance)
//teacher view student attendance request
router.get("/View_Student_Requests", authController.protect,authController.restrict("Student","Admin"), attendenceController.viewAttendanceRequest )
//1.admin view student attendance request
router.get("/Admin_View_Student_Request",authController.protect,authController.restrict("Student","Teacher"), attendenceController.viewAttend_Request)
//teacher or admin view specific student request
router.get("/View_Specific_Student_request/:attendance_student_id",authController.protect,authController.restrict("Student"), attendenceController.view_Specific_Student_Request)
//teacher or admin accept or reject the attendance request
router.post("/Accept_Reject_Student_Request/:attendance_student_id/:status",authController.protect,authController.restrict("Student"), attendenceController.Accept_Reject_Student_Request)
//teacher or admin accept the attendance request 
router.post("/Accept_Request/:attendance_student_id",authController.protect,authController.restrict("Student"),  attendenceController.Accept_Student_Request)
//teacher or admin  reject the attendance request
router.post("/Reject_Request/:attendance_student_id",authController.protect,authController.restrict("Student"),attendenceController.Reject_Student_Request)
//student view attendance
router.get("/Student_View_Attendance",authController.protect, attendenceController.viewAttendance)
//admin view attendance of all student 
router.get("/Admin_View_Student_Attendance",authController.protect,authController.restrict("Teacher","Student"), attendenceController.Admin_viewAttendance)
//admin view specific student attendance
router.get("/Admin_View_Specific_Student_Attendance/:attendance_student_id",authController.protect,authController.restrict("Teacher","Student"),attendenceController.Admin_view_SpecificStudent_Attendance)
//admin change attendance
router.patch("/Admin_Change_Attendance/:user_id",authController.protect, authController.restrict("Teacher","Student"),attendenceController.changeattendance)

module.exports=router;