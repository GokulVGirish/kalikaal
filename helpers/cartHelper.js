const cartModel=require("../models/cartModel")
const productModel=require("../models/productModel")
const offerHelper=require("../helpers/offerHelper")
const cartCount=(userId)=>{

    return new Promise(async(resolve,reject)=>{
       try{
         const cart = await cartModel.findOne({ userId: userId });
         const count = 0;
         if (cart) {
           const count = cart.items.length;

           resolve(count);
         } else {
           resolve(count);
         }

       }
       catch(error){
        console.log(error)
       }
        
    })


}
const totalSubtotal=(userId,products)=>{
    return new Promise(async(resolve,reject)=>{
       try{
         let total = 0;

         const cart = await cartModel.findOne({ userId: userId });
         for (let i = 0; i < products.length; i++) {
           total = total + products[i].salePrice * products[i].quantity;
         }
       


         cart.totalAmount = parseFloat(total);
         await cart.save();
         resolve(total);

       }
       catch(error){
        console.log(error)
       }

    })
}
const incOrDecProductQuantity=(userId,productId,quantity,size)=>{
    return new Promise(async(resolve,reject)=>{
       try{
         const cart = await cartModel.findOne({ userId: userId });
         const product = cart.items.find((item) => {
           return item.productId.toString() === productId && item.size === size;
         });
         const item=await productModel.findOne({_id:productId})
        const itemInReal = await offerHelper.offerCheckForProduct(item);
        
         const proPrice = itemInReal.salePrice;
         let newQty = product.quantity + parseInt(quantity);
         if (newQty < 1) {
           newQty = 1;
         }
         if (newQty > 5) {
           newQty = 1;
           resolve({
             newQty: "You can only buy 5 products each",
             proPrice: 0,
           });
           return;
         }
         const productfind = await productModel.findOne({ _id: productId });
         if (newQty > productfind.size[size].quantity) {
           product.quantity = productfind.size[size].quantity;
           await cart.save();
           resolve({
             newQty: "Quantity exceeds available stock.",
             proPrice: 0,
           });
           return; // Exit the function early
         }
         product.quantity = newQty;
         await cart.save();
        
         resolve({ newQty, proPrice });

        
       }
       catch(error){
        console.log(error)
       }

    })
}
const individualTotal=(products)=>{
    return new Promise((resolve,reject)=>{
       try{
         const arrayOfPrice = [];
         for (let i = 0; i < products.length; i++) {
           const price = products[i].salePrice * products[i].quantity;
           arrayOfPrice.push(price);
         }
         resolve(arrayOfPrice);

       }
       catch(error){
        console.log(error)
       }

    })
}
const clearAllCartItems=(userId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await cartModel.deleteOne({ userId: userId });
            resolve(result);

        }
        catch(error){
            console.log(error)
        }

    })
}
module.exports={
    cartCount,
    totalSubtotal,
    incOrDecProductQuantity,
    individualTotal,
    clearAllCartItems
}