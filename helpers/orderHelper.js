const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const ObjectId = require("mongoose").Types.ObjectId;
const offerHelper=require("../helpers/offerHelper")
const couponModel=require("../models/couponModel")
const walletModel=require("../models/walletModel")

const placeOrder = (body, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await cartModel.findOne({ userId: user._id });
     
      const orderAddress = user.address.find((addres) => {
        return addres._id.toString() === body.addressId;
      });
      
      let response={}

      let products = [];
        
      for (let item of cart.items) {
         const singleProduct = await productModel.findOne({_id:item.productId})
         if(singleProduct.size[item.size].quantity<item.quantity){
          response.status=false
          response.name=singleProduct.productName
          resolve(response)

          return
         }
          
       const product = await offerHelper.offerCheckForProduct(singleProduct);
       if(cart.coupon){
        const coupon=await couponModel.findOne({couponCode:cart.coupon})
        const discount=coupon.discount
        product.salePrice=product.salePrice-(product.salePrice/100)*discount

       }
         
      
         

        
        products.push({
          product: item.productId,
          quantity: item.quantity,
          size: item.size,
          productPrice: product.salePrice,
        });

       

        let changeStock = await productModel.findById(item.productId);
        
        if (!changeStock) {
          
          console.log(`Product with ID ${item.productId} not found.`);
          continue; 
        }


        changeStock.size[item.size].quantity -= item.quantity;
        changeStock.totalQuantity -= item.quantity;
        await changeStock.save()
      }
      
      
      if (cart && orderAddress) {
        
        const result = await orderModel.create({
          user: user._id,
          products: products,
          address: {
            name: orderAddress.name,
            house: orderAddress.houseName,
            city: orderAddress.CityorTown,
            state: orderAddress.state,
            country: orderAddress.country,
            pincode: orderAddress.pincode,
            mobile: orderAddress.mobile,
          },
          paymentMethod: body.paymentOption,
          totalAmount: cart.totalAmount,
          ...(cart.coupon && { coupon: cart.coupon }),
        });
        response.status=true
        response.result=result
        
        resolve(response);
      }
    } catch (error) {
      console.log(error);
    }
  });
};
const getOrderDetails=(userId)=>{
  return new Promise(async(resolve,reject)=>{
   try{
     const orders=await orderModel.find({user:userId}).sort({orderedOn:-1})
    resolve(orders)
   }
   catch(error){
    console.log(error)
   }
  })
}
const getSingleOrderDetails=(orderId)=>{
  return new Promise(async(resolve,reject)=>{

    try{
      const SingleOrderDetails = await orderModel.aggregate([
        {
          $match: { _id: new ObjectId(orderId) },
        },
        {
          $project: {
            user: 1,
            totalAmount: 1,
            paymentMethod: 1,
            orderedOn: 1,
            status: 1
          },
        },
      ]);
      
      resolve(SingleOrderDetails)

    }
    catch(error){
      console.log(error)

    }
  })
}
 const getOrderDetailsOfEachProduct=(orderId)=>{
  return new Promise(async(resolve,reject)=>{
    try{
      const orderDetails=await orderModel.aggregate([
        {$match:{
          _id:new ObjectId(orderId)
        }},
        {$unwind:"$products"},
        {$lookup:{
          from:"products",
          localField:"products.product",
          foreignField:"_id",
          as:"orderedProduct"
        }},
        {$unwind:"$orderedProduct"}
      ])
      
      resolve(orderDetails)

    }
    catch(error){
      console.log(error)
    }
  })
 }
 const CancelSingleOrder=(orderId,singleOrderId,userId)=>{
  return new Promise(async(resolve,reject)=>{
    try{
     
      const cancelled=await orderModel.updateOne({_id:new ObjectId(orderId),"products._id":new ObjectId(singleOrderId)},
      {$set:{"products.$.status":"cancelled"}})
      const productItem=await orderModel.findOne({_id:new ObjectId(orderId),"products._id":new ObjectId(singleOrderId)})
      const filteredProduct=productItem.products.find((item)=>{
      
        return singleOrderId.toString() === item._id.toString();

      })
      const productModify = await productModel.findOne({
        _id: filteredProduct.product
      });
      
      productModify.size[filteredProduct.size].quantity =
        productModify.size[filteredProduct.size].quantity +
        filteredProduct.quantity;
        productModify.totalQuantity =
          productModify.totalQuantity + filteredProduct.quantity;
        await productModify.save()
        productItem.totalAmount=productItem.totalAmount-filteredProduct.productPrice
        await productItem.save()
        if(productItem.paymentMethod==="RazorPay"){
          
           const updatedWallet = await walletModel.updateOne(
             { user: userId },
             {
               $push: {
                 walletData: {
                   date: new Date(),
                   paymentMethod: productItem.paymentMethod,
                   amount: filteredProduct.productPrice,
                 },
               },
               $inc: { balance: filteredProduct.productPrice }, 
             },
             { upsert: true}
           );
        }
   
        const order = await orderModel.findOne({ _id: new ObjectId(orderId) });
        const allCancelled = order.products.every(
          (product) => product.status === "cancelled"
        );

      
        if (allCancelled) {
          await orderModel.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status: "cancelled" } }
          );

        }
        resolve({totalAmount:productItem.totalAmount})
    }
    catch(error){
      console.log(error)
    }

  })
 }
 const cancelOrder=(orderId)=>{
  return new Promise(async(resolve,reject)=>{
    try{
      const order=await orderModel.findOne({_id:orderId})
 
      if(order){
        order.status="cancelled"
        for (let singleProduct of order.products){
          singleProduct.status="cancelled"

        }
        order.save()
        resolve(order)
      }
      else{
        reject(Error("Order not found"))
      }

    }
    catch(error){
      console.log(error)
    }
  })
 }
 const returnOrder=(orderId,singleOrderId)=>{
  return new Promise(async(resolve,reject)=>{
    const returned = await orderModel.updateOne(
      {
        _id: new ObjectId(orderId),
        "products._id": new ObjectId(singleOrderId),
      },
      { $set: { "products.$.status": "return pending" } }
    );
    resolve(returned)


  })
 }
 const getAllOrders=()=>{
  return new Promise(async(resolve,reject)=>{
    try{
    const result = await orderModel.aggregate([
      {
        $sort: {
          orderedOn: -1, // Sorting by "orderedOn" field in ascending order
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userOrderDetails",
        },
      },
    ]);

      if(result){
       
        resolve(result)
      }
      else{
        reject(Error("user orders not found"))
      }


    }
    catch(error){
      console.log(error)
    }
  })
 }
 const orderStatusChange=(orderId,status)=>{
  return new Promise(async(resolve,reject)=>{
    try{
        const order= await orderModel.findOne({_id:orderId})
        order.status=status
        await order.save()
        resolve(order)
    }
    catch(error){
      console.log(error)
    }
  })
 }
 const orderStatusChangeForEachProduct=(userId,orderId,productId,status)=>{
  return new Promise(async(resolve,reject)=>{
    try{
    
      const result=await orderModel.updateOne(
        {_id:new ObjectId(orderId),"products._id": new ObjectId(productId)},
        {$set:{"products.$.status":status}}
        )
          console.log("status",status)
          if (status === "returned") {
           
             const productItem = await orderModel.findOne({
               _id: new ObjectId(orderId),
               "products._id": new ObjectId(productId),
             });
             const filteredProduct = productItem.products.find((item) => {
             
               return productId.toString() === item._id.toString();
             });
            
            
            const updatedWallet = await walletModel.updateOne(
              { user: userId },
              {
                $push: {
                  walletData: {
                    date: new Date(),
                    paymentMethod: productItem.paymentMethod,
                    amount: filteredProduct.productPrice,
                  },
                },
                $inc: { balance: filteredProduct.productPrice },
              },
              { upsert: true }
            );
          }
        resolve(result)


    }
    catch(error){
      console.log(error)
    }
  })
 }
module.exports = {
  placeOrder,
  getOrderDetails,
  getSingleOrderDetails,
  getOrderDetailsOfEachProduct,
  CancelSingleOrder,
  cancelOrder,
  getAllOrders,
  orderStatusChange,
  orderStatusChangeForEachProduct,
  returnOrder
};
