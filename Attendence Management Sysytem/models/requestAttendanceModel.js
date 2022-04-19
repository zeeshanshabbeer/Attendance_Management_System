const mongoose = require("mongoose")

const attendanceRequestSchema=mongoose.Schema({
    attendance_Teacher_id:{
        type:String,
        required:true,
    },
    attendance_student_id:{
            type:String,
            required:true,
        },
            attendance_type:{
            type:String,
            required:true,
            enum:["Absent","Present"]
          },
            attendance_description:{
            type:String,
            required:true,
          },
          date:{
            type:Date,
            required:true,
            default:Date.now()  
        }

})


//----Create Collection in Database
const RequestAttendance = mongoose.model("RequestAttendance", attendanceRequestSchema);
module.exports = RequestAttendance;