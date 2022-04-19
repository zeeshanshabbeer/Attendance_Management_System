const express=require("express");
const router=express.Router();
const authController=require("./../controllers/authController")
const holidayController=require("../controllers/holidayController")

router.post("/Add_Holiday",authController.protect,authController.restrict("Student","Teacher"), holidayController.addHoliday)
//view holiday
router.get("/View_Holiday",authController.protect, holidayController.viewHoliday)
//admin delete holiday
router.delete("/Delete Holiday/:holiday_employee_id",authController.protect,authController.restrict("Student","Teacher"),holidayController.deleteHoliday);
router.put("/Edit_Holiday",authController.protect,authController.restrict("Student","Teacher"),holidayController.editHoliday)


module.exports=router;