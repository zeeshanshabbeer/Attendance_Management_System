const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const validator = require('validator');
const catchAsync = require("../utils/catchAsync");

const attendanceSchema=mongoose.Schema({
    attendance_Teacher_id:{
        type:String,
        required:true,
    },
    attendance_student_id:{ 
        type:String,
        required:true,
    },
    request:[{
        attendance_type:{
            type:String,
            enum:["Absent","Present"]
          },
        attendance_description:{
            type:String
          },
          date:{
              type:Date,
              default:Date.now()
          }
    }]
})
//--------add attendances requestss------
attendanceSchema.methods.add =async function(attendance_type,attendance_description){
    try {
        this.request = this.request.concat({ attendance_type,attendance_description })
        await this.save();
        return this.request;    
    } catch (error) {
        console.log(error)
    }    
}


//----Create Collection in Database
const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;