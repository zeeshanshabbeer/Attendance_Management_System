const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const validator = require('validator');

const holidaySchema=mongoose.Schema({
    holiday_employee_id:{
        type:String,
        required:true,
    },
    holiday_date:{
        type:Date,
        required:true,
    },
    holiday_duration:{
        type:Number,
        required:true,
        enum:[1,2,3,4,5,6,7,8,9,10]
      },
    holiday_description:{
        type:String,
        required:true,
      },
})


//----Create Collection in Database
const Holiday = mongoose.model("Holiday", holidaySchema);
module.exports = Holiday;