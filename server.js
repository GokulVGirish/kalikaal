const express=require("express");
const path=require("path");
const app=express();
const userRoute=require("./routes/userRoute")
const session=require("express-session")

const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/kalikaal")
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
})
app.use(express.urlencoded({ extended: true }));
app.use("/public",express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(session({
    secret:"1231fdsdfssg33435",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:3600*1000
    }

}))




app.use("/",userRoute)
const PORT=3004;
app.listen(PORT,()=>{
    console.log("server startred on http://localhost:3004")
})