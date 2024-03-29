const express=require("express");
const path=require("path");
const dotenv=require("dotenv")
dotenv.config({path:"./config.env"})
const app=express();
const userRouter=require("./routes/userRoute")
const adminRouter=require("./routes/adminRoute")
const session=require("express-session")
const bodyParser = require("body-parser");
const flash=require("express-flash")
const methodOverride = require("method-override");


const nocache=require("nocache")

require("./DB/dataBase")


app.use(nocache())
//  method-override middleware
app.use(methodOverride("_method"));

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use("/public",express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")
app.set("views", [path.join(__dirname, "views/user"), path.join(__dirname, "views/admin")])
app.use(session({
    secret:process.env.SESSION_SECRET_KEY,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:3600*1000
    }

}));

app.use(flash());
app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})



app.use("/",userRouter)
app.use("/admin",adminRouter)
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
 
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};


  res.status(err.status || 500);
  res.render("error", { layout: false });
});


app.listen(process.env.PORT,()=>{
    console.log("server startred on http://localhost:3004, for admin http://localhost:3004/admin")
})