const express=require("express");
const router=express.Router();
const authController=require("./../controllers/authController")
const userController=require("./../controllers/userController")

//Only admin registered the Student and teacher
router.post("/signup",authController.protect, authController.restrict("Student","Teacher"), authController.registration);
//login
router.post("/login",authController.login);
// profile
router.get("/profile",authController.protect, authController.profile);
//update password
router.patch("/updatepassword",authController.protect, authController.updatePassword);
//update ContactNo
router.patch("/updateContactNo",authController.protect,authController.updateContactNo)
//logout the user
router.post("/logout",authController.protect,authController.logout);
//reset password
router.patch("/resetPassword", userController.resetPassword);
// reset passwordlink
router.post("/resetPasswordLink", userController.resetLink);
//teacher and Admin view student profile
router.get("/View_Student_profile",authController.protect, authController.restrict("Student"), userController.viewProfile)
//teacher view specific student profile
router.get("/View_Specific_Student_profile/:user_id",authController.protect, authController.restrict("Student"), userController.view_Specific_Profile)
//Admin view profile of teacher and student
router.get("/Admin_viewProfile",authController.protect, authController.restrict("Student","Teacher"), userController.Admin_viewProfile)
//admin view specific student and teacher profile
router.get("/Admin_ViewSpecificProfile/:user_id",authController.protect, authController.restrict("Student","Teacher"),userController.Admin_view_Specific_Profile)

module.exports=router;