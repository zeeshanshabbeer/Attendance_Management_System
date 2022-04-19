const mongoose = require("mongoose")

const leaveSchema=mongoose.Schema({
    leave_user_id:{
        type:String,
        required:true
    },
    leave_type:{
        type:String,
        required:true,
        enum:["Sick leave","Family issue","Marriage leave"]
    },
    leave_to:{
        type:Date,
        required:true
    },
    leave_from:{
        type:Date,
        required:true
      },
    leave_description:{
        type:String,
        required:true
      },
})


//----Create Collection in Database
const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;