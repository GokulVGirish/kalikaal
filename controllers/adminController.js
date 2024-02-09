const adminModel=require("../models/adminModel")

const loginload = (req, res) => {
    if(req.session.admin){
        res.redirect("/admin/admindash")
    }
    else{
        const message=req.flash("message")
        res.render("adminLogin",{message:message})
    }

};
const logAdmin=async(req,res)=>{
    const admin= await adminModel.findOne({email:req.body.email})
    if(admin){
        if(admin.password===req.body.password){
            req.session.admin=admin
           
            res.redirect("/admin/admindash")

        }
        else{
             req.flash("message","Invalid username or password")
            res.redirect("/admin")

        }

    }
    else{
        req.flash("message","Invalid username or password")
        res.redirect("/admin")

    }
   

}
const adminDash=(req,res)=>{
    if(req.session.admin){
        res.render("adminDash")
       

    }
    else{
        res.redirect("/admin")
     
    }

}
const adminLogout = (req, res) => {
  try {
    delete req.session.admin;
    res.redirect("/admin");
  } catch (error) {
    res.status(500).render("error", { error, layout: false });
  }
};

module.exports={
    loginload,
    logAdmin,
    adminDash,
    adminLogout
}