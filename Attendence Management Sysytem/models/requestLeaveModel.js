const mongoose = require("mongoose")

const leaveRequestSchema=mongoose.Schema({
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
        type:String,
        required:true,
    },
    leave_from:{
        type:String,
        required:true
      },
    leave_description:{
        type:String,
        required:true,
      },
})


//----Create Collection in Database
const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
module.exports = LeaveRequest;