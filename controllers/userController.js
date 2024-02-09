const userModel = require("../models/userModel");
const userHelper = require("../helpers/userHelper");
const nodemailer = require("nodemailer");
const productModel=require("../models/productModel")
const productHelper=require("../helpers/productHelper")
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service
  auth: {
    user: process.env.email, // Replace with your email address
    pass: process.env.passkey // Replace with your email password
  },
});

function generateOtp() {
  const digits = "1234567890";
  var otp = "";
  for (i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}
const sentOtp = async (req, res) => {
  console.log("request come to send the otp");
  try {
    const email = req.params.id;
    req.session.email=email
    console.log("entered");
    const otp = generateOtp();
    req.session.otpCreationTime = Date.now();
    req.session.otpExpiryTime = Date.now() + 60 * 1000;
    console.log(`otp generated ${otp}`);
    const userEmail = email;
    console.log(userEmail);
    if (!userEmail) {
      return res
        .status(400)
        .json({ error: "Invalid or missing email address" });
    }
    const mailOptions = {
      from: "gokulawesome365@gmail.com",
      to: userEmail,
      subject: "Your Otp Verfication code",
      text: `Your Otp is ${otp} `,
    };
    await transporter.sendMail(mailOptions);
    req.session.otp = otp;
    res.json({ message: "OTP Send To Your Email" });
  } catch (error) {
  
    console.log(error);
    res.status(500);
  }
};
const verifyOtp = (req, res) => {
  const sendedOtp = req.session.otp;
  const verifyOtp = req.body.otp;
  console.log(sendedOtp);
  console.log(verifyOtp);
  console.log("started checking");
  if (sendedOtp === verifyOtp) {
    if (Date.now() < req.session.otpExpiryTime) {
      console.log("autharised");
      req.session.otpmatched = true;
      res.json({ status: true, message: "Success" });
    } else {
      req.session.otpmatched = false;
      res.json({ status: false, message: "failed" });
    }
  } else {
    req.session.otpmatched = false;
    res.json({ status: false, message: "failed" });
  }
};

const loadregister = (req, res) => {
  if (req.session.user) {
    res.redirect("userhome");
  } else {
    res.render("signup");
  }
};
const loginload = (req, res) => {
  if (req.session.user) {
    res.redirect("userhome");
  }else {
    const message = req.flash("message");
    res.render("login", { message: message });
  }
};
const logUser = async (req, res) => {
  await userHelper.doLogin(req.body).then((response) => {
    if (response.loggedIn) {
      req.session.user = response.user;
      //  return res.status(202).json({error:false,message:response.logginMessage})
      res.redirect("userhome");
    } else {
     res.render("login",{message:response.logginMessage})
    }
  });
};
const insertUser = async (req, res) => {
  const response = await userHelper.doSignup(req.body, req.session.otpmatched,req.session.email);
  if (response.status) {
    req.flash("message", response.message);
    res.redirect("/");
  } else {
    res.render("signup", { message: response.message });
  }
};
const userHome = async (req, res) => {
  if (req.session.user) {
   try{ 
    const productList = await productHelper.getFilteredProducts()
   res.render("userhome", { productList: productList });
    
   }
   catch(error){
    console.log(error)

   }
  } else {
    res.redirect("/");
  }
};
const userLogout = (req, res) => {
  try {
    console.log("hello")
    req.session.user = null;
    res.redirect("/");
  } catch (error) {
    res.status(500).render("error", { error, layout: false });
  }
};
const getProductDetailsPage=async(req,res)=>{
  try{
    const id = req.query.id;
    console.log(id)
   const findProduct = await productModel
     .findOne({ _id: id })
     .populate("category");
    console.log(findProduct)
    res.render("product-view",{data:findProduct})

  }
  catch(error){

  }

}
const loadQuantity=async(req,res)=>{
  try{
    const id=req.query.id
     const prosize = req.query.size;
    console.log("queryid",id)
    console.log("querysize",prosize)
   
    const product=await productModel.findOne({_id:id})
    
    const quantity={
      's':product.size.s.quantity,
      'm':product.size.m.quantity,
      'l':product.size.l.quantity
      
    }
    const sendsize=quantity[prosize]
    console.log("sendsize",sendsize)
    res.json({message:sendsize})

  }
  catch(error){
    console.log(error)

  }
}

module.exports = {
  loginload,
  loadregister,
  logUser,
  insertUser,
  userHome,
  userLogout,
  sentOtp,
  verifyOtp,
  getProductDetailsPage,
  loadQuantity
};
