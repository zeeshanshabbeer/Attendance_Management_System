const mongoose = require("mongoose");

const connectDb = async() => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        })
        console.log("Database connected Successful!")
    } catch (error) {
        console.log(`error: ${error.message}`)
        process.exit(1);
    }
}
module.exports = connectDb;