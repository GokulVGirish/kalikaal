const userModel=require("../models/userModel")
const cartHelper=require("../helpers/cartHelper")
const orderHelper=require("../helpers/orderHelper")
const otpHelper=require("../helpers/otpHelper")
const userHelper=require("../helpers/userHelper")
const bcrypt=require("bcryptjs")
const crypto=require("crypto")
const wishlistHelper=require("../helpers/wishlistHelper")
const walletModel=require("../models/walletModel")

const loadProfile=async(req,res,next)=>{
 try{
       if(req.session.user){
        
        
       
          const {
            user: { _id: userId, referralCode:refferalCode },
          } = req.session;

         
        const cartCount = await cartHelper.cartCount(userId);
        const wishlistCount = await wishlistHelper.wishlistCount(userId);
        const user=await userModel.findById(userId)
        const orderDetails=await orderHelper.getOrderDetails(userId)
        const wallet=await walletModel.findOne({user:userId})
        wallet?.walletData.sort((a, b) => b.date - a.date);
      
      
        const message = req.flash("message");
        const errormessage=req.flash("errormessage")
        res.render("userProfile",{user:user,cartCount:cartCount,orderDetails:orderDetails,message:message,errormessage,wallet,refferal:refferalCode,wishlistCount})
    }
    else{
        res.redirect('/login')
    }
 }
 catch(error){
   next(error)
 }
}
const addAddress=async(req,res,next)=>{
   try{
     const userId = req.query.id;
     const checkout = req.query.checkout ? req.query.checkout : 0;

     const user = await userModel.findById(userId);
     user.address.push({
       name: req.body.addresName,
       mobile: req.body.addressmobile,
       houseName: req.body.housename,
       pincode: req.body.pincode,
       CityorTown: req.body.townOrCity,
       district: req.body.district,
       state: req.body.state,
       country: req.body.country,
     });
     await user.save();
     if(checkout==1){
      req.flash("message","address added")
      res.redirect("/checkout");
     }
     else{
      res.redirect("/userprofile");
     }
     

   }
   catch(error){
   next(error)
   }


}
const getEditAddress=async(req,res,next)=>{
   try{
     const userId=req.session.user._id
     const cartCount = await cartHelper.cartCount(userId);
    const addressId=req.query.id
        const user=await userModel.findById(userId)
        const addressToEdit=user.address.find((address)=>{
            return address._id.toString() === addressId;

        })

    res.render("editAddress",{user:user,address:addressToEdit,cartCount:cartCount})
   }
   catch(error){
  next(error)
   }
    
}
const editAddress=async(req,res,next)=>{
    try{
        const addressId=req.query.id
        const userId=req.session.user._id
        const user=await userModel.findById(userId)
    
        const addressIndex=user.address.findIndex((address)=>{
               return address._id.toString()=== addressId
        })
      

       
        user.address[addressIndex].name = req.body.addresName;
        user.address[addressIndex].mobile = req.body.addressmobile;
        user.address[addressIndex].houseName = req.body.housename;
        user.address[addressIndex].pincode = req.body.pincode;
        user.address[addressIndex].CityorTown = req.body.townOrCity;
        user.address[addressIndex].district = req.body.district;
        user.address[addressIndex].state = req.body.state;
        user.address[addressIndex].country = req.body.country;
        await user.save()
        res.redirect("/userprofile")



    }
    catch(error){
       next(error)
    }

}
const setDefaultAddress=async(req,res,next)=>{
  try{
    const id=req.query.id
    const userId=req.session.user._id
    const user=await userModel.findOne({_id:userId})
       user.address.forEach((address) => {
         if (address._id.toString() === id) {
           address.isDefault = true;
         } else {
           address.isDefault = false;
         }
       });

    await user.save()
    res.json({success:true})
    

  }
  catch(error){
 next(error)
  }
}
const editUserInfo=async(req,res,next)=>{
    try{
        const userId=req.session.user._id
        const user=await userModel.findById(userId)
        const passverified=await bcrypt.compare(req.body.password,user.password)
        if(passverified){
            user.name=req.body.name
            user.phone=req.body.mobile
            user.email=req.body.email
            await user.save();
            
            req.flash("message","user Info updated")
            res.redirect("/userprofile");
        
        }else{
          req.flash("errormessage", "Password verification failed");
        
            res.redirect("/userprofile")
        }
        
        

    }
    catch(error){
      next(error)

    }
    
}
const editUserPassword=async(req,res,next)=>{
    try{
        const userId = req.session.user._id;
        const user = await userModel.findById(userId);
        if(req.body.npassword===req.body.cpassword){

            const passverified = await bcrypt.compare(
              req.body.password,
              user.password
            );
            if(passverified){
                const hashedPassword = await bcrypt.hash(req.body.npassword, 10);
               
                // Update the user's password
                await userModel.findByIdAndUpdate(userId, {
                  $set: { password: hashedPassword },
                });
                
                
                req.flash("message", "password changed seccessfully");
                res.redirect("/userprofile")
            }else{
              req.flash("errormessage", "wrong password");
               
                res.redirect("/userprofile");

            }


        }
        else{
          req.flash("errormessage", "new and conf password dont match");
          
            res.redirect("/userprofile")
        }

    }
    catch(error){

     next(error)
    }

}
const deleteAddress=async(req,res,next)=>{
  try{  
    
    const addressId = req.query.id;
    
  const userId = req.session.user._id;
  
  const result = await userModel.updateOne(
    { _id: userId },
    { $pull: { address: { _id: addressId } } }
  );
  res.json({success:true,addressId:addressId})


  }
  catch(error){
next(error)
  }

}
const getOrderDetailsPage=async(req,res,next)=>{
  try{
      const orderId=req.params.id
      const user=req.session.user
    const orderDetails=await orderHelper.getSingleOrderDetails(orderId)
    const productDetails = await orderHelper.getOrderDetailsOfEachProduct(orderId)
    const wishlistCount=await wishlistHelper.wishlistCount(user._id)
    const cartCount=await cartHelper.cartCount(user._id)
    
 
    if(orderDetails&&productDetails){
        res.render("orderDetails",{orderDetails,productDetails,user,cartCount,wishlistCount})
    }
  }
  catch(error){
  next(error)
  }

}
const CancelSingleOrder=async(req,res,next)=>{

  try{
  
   
     const { id: orderId, singleOrderId } = req.query;

     const userId=req.session.user._id
     const result=await orderHelper.CancelSingleOrder(orderId,singleOrderId,userId)
     if(result){
      res.json({success:true,singleOrderId:singleOrderId,totalAmount:result.totalAmount})
     }
     else{
      res.json({success:false})
     }



  }
  catch(error){
  next(error)
  }
}
const cancelOrder=async(req,res,next)=>{
  try{
    const orderId=req.query.id
    const result= await orderHelper.cancelOrder(orderId)
    if(result){
      res.json({success:true,orderId:orderId})
    }
    else{
      res.json({success:false})
    }

  }
  catch(error){
  next(error)
  }
}
const returnOrder=async(req,res,next)=>{
  try{
    
    const { orderId, singleOrderId } = req.query;

    const result=await orderHelper.returnOrder(orderId,singleOrderId)
    if (result) {
      res.json({ success: true, singleOrderId: singleOrderId });
    } else {
      res.json({ success: false });
    }


  }
  catch(error){
   next(error)
  }
}
const sendEmailOtp=async(req,res,next)=>{
  try{
    const email=req.query.email
    req.session.email=email
    const otp=await otpHelper.generateOtp(email)
 
    req.session.otpExpiryTime = Date.now() + 60 * 1000;
    req.session.otp=otp
  
    res.json({ message: "OTP Send To Your Email" });




  }
  catch(error){
 next(error)
  }
}
const changeEmail=async(req,res,next)=>{
  try{
    
    
    const { newEmail, password } = req.body;

    const userId=req.session.user._id;
   
    const response =  await userHelper.emailModify (
      newEmail,
      req.session.email,
      password,
      req.session.otpmatched,userId
    );
 
   if(response.status){
     req.flash("message", response.updateMessage);
     res.redirect("/userprofile");
   }
   else{
     req.flash("errormessage", response.updateMessage);
     res.redirect("/userprofile");
   }
    


  }
  catch(error){
   next(error)
  }
}
const addMoneyTOWallet=async(req,res,next)=>{
  
  try{
    const userId=req.session.user._id
    const amount=JSON.parse(req.body.amount)
    const razorpay= await userHelper.generateRazorpay(userId,amount)
    if(razorpay.success===true){
      res.json({status:true,order:razorpay.order})
    }else{
      res.json({status:false})
    }

  }
  catch(error){
   next(error)
  }
}
const verifyPaymentToWallet=async(req,res,next)=>{
  try{
  
     const userId = req.session.user._id;
     const user = await userModel.findOne({ _id: userId });
     
const { payment, order: { id: orderId } } = req.body;


     const amount=JSON.parse(req.body.amount)

     const secret = "O3wYE8sZfw1DSf3wOC4nSpmQ"; 
     const generatedSignature = crypto
       .createHmac("sha256", secret)
       .update(orderId + "|" + payment.razorpay_payment_id)
       .digest("hex");

     if (generatedSignature === payment.razorpay_signature) {
        
            const updatedWallet = await walletModel.updateOne(
              { user: userId },
              {
                $push: {
                  walletData: {
                    date: new Date(),
                    paymentMethod: "razorpay",
                    amount: amount,
                  },
                },
                $inc: { balance: amount },
              },
              { upsert: true }
            );
            res.json({success:true,message:"money added"})
          
     

       
     } else {
       console.log("Payment verification failed");
       res
         .status(400)
         .json({ success: false, message: "Payment verification failed" });
     }

  }
  catch(error){
    next(error)
  }
}
module.exports = {
  loadProfile,
  addAddress,
  getEditAddress,
  editAddress,
  editUserInfo,
  editUserPassword,
  deleteAddress,
  getOrderDetailsPage,
  CancelSingleOrder,
  cancelOrder,
  sendEmailOtp,
  changeEmail,
  returnOrder,
  setDefaultAddress,
  addMoneyTOWallet,
  verifyPaymentToWallet
};