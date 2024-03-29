const couponHelper=require("../helpers/couponHelper")
const couponModel=require("../models/couponModel")
const cartModel=require("../models/cartModel")
const getCouponPage=async(req,res,next)=>{
    try{
        const coupons= await couponHelper.getAllCoupons()
        const message=req.flash("message")
        res.render("coupon",{coupons,message})

    }
    catch(error){
       next(error)
    }
}
const addCoupon=async(req,res,next)=>{
    try{
        const result=await couponHelper.addCoupon(req.body)
        if(result.success){

            req.flash("message","coupon added sucessfully")

             res.redirect("/admin/coupons");

        }
        else{
              req.flash("message", "coupon with same name already exist");
            res.redirect("/admin/coupons");

        }
       

    }
    catch(error){
        next(error)
    }
}
const couponDelete=async(req,res,next)=>{
    try{
        const couponId=req.query.id
       
      
     await couponModel.findOneAndDelete({_id:couponId})
       res.json({success:true,url:"/admin/coupons"})

    }
    catch(error){
       next(error)
    }

}
const getEditCoupon=async(req,res,next)=>{

 const formatDateForInput = (dateString) => {
 
   const date = new Date(dateString);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
 };

    try{
        const id=req.query.id
        const coupon= await couponModel.findOne({_id:id})
 
        const newdatecreated = formatDateForInput(coupon.createdOn);
       
       const newdateexpired = formatDateForInput(coupon.expireOn);
    
     
        res.render("editCoupon",{coupon,createdOn:newdatecreated,expireOn:newdateexpired})

    }
    catch(error){
        next(error)
    }
}
const editCoupon=async(req,res,next)=>{
    try{
        const id=req.query.id
        const result=await couponHelper.editCoupon(id,req.body)
        
            req.flash("message",result.message)
            res.redirect("/admin/coupons");
        

    }
    catch(error){
       next(error)
    }

}
const applyCoupon=async(req,res,next)=>{
    try{
        const couponCode=req.query.code
        const userId=req.session.user._id
       const result=await couponHelper.applyCoupon(userId,couponCode)
       if(result.success){
        res.json({
          success: true,
       
          message:result.message,
          couponName:result.couponName,
           couponDiscount:result.couponDiscount,
           totalAmount:result.totalAmount,
           couponId:result.couponId
        });

       }{
         res.json({
           success: false,
           message: result.message
         });


       }
       
    }
    catch(error){
       next(error)
    }
}
const clearCoupon=async(req,res,next)=>{
    try{
       
        
        
        const userId=req.session.user._id
        const cart=await cartModel.findOne({userId:userId})
        cart.totalAmount += cart.discountedAmount;
        await cartModel.updateOne(
          { userId: userId },
          { $unset: { discountedAmount :null} }
        );
        
        await cart.save()

        const result=await couponHelper.clearCoupon(userId)
        res.json({success:true,totalAmount:cart.totalAmount})


    }
    catch(error){
     next(error)
    }
}
module.exports={
    getCouponPage,
    addCoupon,
    couponDelete,
    getEditCoupon,
    editCoupon,
    applyCoupon,
    clearCoupon
}