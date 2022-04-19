const express=require("express");
const cookieParser = require('cookie-parser')

const User=require("./routes/userRouter")
const Attendance=require("./routes/attendanceRouter")
const Leave=require("./routes/leaveRouter")
const Holiday=require("./routes/holidayRouter")
const globalErrorHandler=require("./controllers/errorController")
const app=express();
app.use(cookieParser())
app.use(express.json());

app.use('/user', User);
app.use('/user/attendance', Attendance);
app.use("/user/leave",Leave)
app.use("/user/holiday",Holiday)
app.use(globalErrorHandler)

module.exports = app;