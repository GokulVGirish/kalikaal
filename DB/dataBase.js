const mongoose=require("mongoose")
const connectDB=mongoose.connect(process.env.DB)
connectDB
    .then(()=>console.log("Database Connected"))
    .catch((err)=>console.log(err.message))