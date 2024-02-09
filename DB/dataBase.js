const mongoose=require("mongoose")
const connectDB=mongoose.connect(process.env.LOCAL_CONN_STR)
connectDB
    .then(()=>console.log("Database Connected"))
    .catch((err)=>console.log(err.message))