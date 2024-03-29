const orderModel=require("../models/orderModel")
const orderHelper=require("../helpers/orderHelper")
const cartHelper=require("../helpers/cartHelper")

const userModel=require("../models/userModel")
const crypto=require("crypto")
const adminOrdersListGet=async(req,res,next)=>{

    try{
        const allOrders=await orderHelper.getAllOrders()
        
        res.render("ordersList",{allOrders})


    }
    catch(error){
      next(error)

    }
}
const adminOrderStatusChange=async(req,res,next)=>{
    try{
        const orderId=req.body.orderId
        const status=req.body.status
        const result=await orderHelper.orderStatusChange(orderId,status)
       
     if(result){

        res.json({ success: true });


     }
     else{
        res.json({success:false})
     }
        

    }
    catch(error){
       next(error)
    }
}
const adminOrderStatusChangeForEachProduct=async(req,res,next)=>{
    try{
        const userId=req.session.user._id
        
        const { orderId: orderid, productId } = req.params;

        const status=req.body.status
        const result=await orderHelper.orderStatusChangeForEachProduct(userId,orderid,productId,status)
       
        if(result){
            res.json({success:true})
        }
        else{
            res.json({success:false})
        }

    }
    catch(error){
     next(error)
    }

}
const adminOrderDetailsGet=async(req,res,next)=>{
    try{
        
        const { id: orderId, userId } = req.params;

        const user=await userModel.findById(userId)
        const productDetails=await orderHelper.getOrderDetailsOfEachProduct(orderId)
        
        
        
        if(productDetails){
            res.render("adminOrderDetails",{productDetails,user})
        }


    }
    catch(error){
      next(error)
    }

}
const verifyPayment = async (req, res,next) => {
   
  try {
    const { payment, order: { id: orderId }, body: data } = req.body;
    const userId=req.session.user._id
    const user=await userModel.findOne({_id:userId})
   
    const secret = "O3wYE8sZfw1DSf3wOC4nSpmQ"; // Replace with your actual Razorpay secret key
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(orderId + "|" + payment.razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === payment.razorpay_signature) {
        
         const result = await orderHelper.placeOrder(data, user); 
         const cleared = await cartHelper.clearAllCartItems(user);

    

      res
        .status(200)
        .json({
          success: true,
          url: `/ordersuccesspage?id=${result.result._id}`,
        });
    } else {
 
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
  
   next(error)
  }
};
module.exports={
    adminOrdersListGet,
    adminOrderStatusChange,
    adminOrderDetailsGet,
    adminOrderStatusChangeForEachProduct,
    verifyPayment
}