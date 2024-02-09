const User=require("../models/userModel");
const userHelper=require('../helpers/userHelper')

const loadregister=(req,res)=>{
    if (req.session.user) {
    res.redirect("/userhome");
  } else if (req.session.admin) {
    res.redirect("/adminhome");
  } else {
    res.render("users/signup");
  }
    // res.render("signup")
}
const loginload=(req,res)=>{
    if(req.session.user){
        res.redirect("/userhome");
    }
    else if(req.session.admin){
        res.redirect("/adminhome");
    }else{
        res.render("users/login")

    }
    // res.render("login")
}


const logUser=async(req,res)=>{
await userHelper.loginuser(req.body).then((response)=>{

}).catch((error)=>{
    console.log(error)
})
}
module.exports={
    loginload,
    loadregister,logUser
};