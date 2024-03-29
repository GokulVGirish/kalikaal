
const cartHelper=require("../helpers/cartHelper")
const cartModel=require("../models/cartModel")
const productModel=require("../models/productModel")
const orderHelper=require("../helpers/orderHelper")
const userModel=require("../models/userModel")
const orderModel=require("../models/orderModel")
const couponModel=require("../models/couponModel")
const offerHelper=require("../helpers/offerHelper")
const userHelper=require("../helpers/userHelper")
const walletModel=require("../models/walletModel")
const couponHelper=require("../helpers/couponHelper")
const wishlistHelper=require('../helpers/wishlistHelper')

const loadCheckOut=async(req,res,next)=>{
    try{
        const userId = req.session.user._id;
        const user=await userModel.findById(userId)
        const cartCount = await cartHelper.cartCount(userId);
            const wishlistCount = await wishlistHelper.wishlistCount(userId)
        const userCart=await cartModel.findOne({userId:userId})
        const wallet=await walletModel.findOne({user:userId})
        let balance
        if(wallet){
          balance=wallet.balance
        }else{
          balance=0
        }
        let products=[]
         for (let i = 0; i < userCart.items.length; i++) {
           const item = await productModel.findById(
             userCart.items[i].productId
           );
             const product = await offerHelper.offerCheckForProduct(item);
           const size = userCart.items[i].size;
           const quantity = userCart.items[i].quantity;
          
           
           const individualPrice=product.salePrice*userCart.items[i].quantity
           const productWithSize = Object.assign(
             {},
             product.toObject(),
             {
               size: size,
             },
             { quantity: quantity },
             {salePrice:product.salePrice},
             
             {individualPrice:individualPrice}
           );
           if (products) {
             products.push(productWithSize);
           }
         }
           const coupons = await couponModel.find({ isListed: true });
         
           await couponHelper.clearCoupon(userId);
        
         const totalPrice = await cartHelper.totalSubtotal(userId, products); 
         products.map((product)=>{
          return product.totalPrice=totalPrice
         })
       
         

         const message=req.flash("message")
        res.render("checkout", {
          cartCount: cartCount,
          user: user,userCart:userCart,
          products:products,
          message,
          coupons,
          balance,
          wishlistCount
        });

    }
    catch(error){
       next(error)
    }

}
const placeOrder=async(req,res,next)=>{

   try{
     const body = req.body;
     const userId = req.session.user._id;

     const user = await userModel.findOne({ _id: userId });

     const userCart = await cartModel.findOne({ userId: userId });

     if (req.body.paymentOption === "COD") {
       const result = await orderHelper.placeOrder(body, user);

       if (result.status) {
         const cleared = await cartHelper.clearAllCartItems(userId);
         res.json({
           success: true,
           url: `/ordersuccesspage?id=${result.result._id}`,
         });
       } else {
         res.json({ success: false, name: result.name });
       }
     } else if (req.body.paymentOption === "wallet") {
       const wallet = await walletModel.findOne({ user: userId });
       if (wallet && wallet.balance >= userCart.totalAmount) {
         const result = await orderHelper.placeOrder(body, user);
         wallet.balance = wallet.balance - userCart.totalAmount;
         await wallet.save();
         const cleared = await cartHelper.clearAllCartItems(userId);
         res.json({
           done: true,
           url: `/ordersuccesspage?id=${result.result._id}`,
         });
       } else {
         res.json({ done: false, message: "add money to wallet" });
       }
     } else {
       const totalAmount = userCart.totalAmount;
       const checker = await userHelper.generateRazorpay(userId, totalAmount);
       if (checker.success) {
         res.json({
           status: true,
           order: checker.order,
           body: body,
         });
       }
     }
      
  



   }
   catch(error){
    next(error)

   }
}
const ordererSuccessPage=async(req,res,next)=>{
  try{
    const orderId=req.query.id
  
    const user=req.session.user
    const order=await orderModel.findOne({_id:orderId}).populate("user")
    res.render("orderSuccessPage",{user:user,order:order})

  }
  catch(error){
 next(error)
  }
}
module.exports={
    loadCheckOut,
    placeOrder,
    ordererSuccessPage
}