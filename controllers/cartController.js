const productModel =require("../models/productModel")
const cartModel=require("../models/cartModel")
const cartHelper=require("../helpers/cartHelper")
const couponHelper=require("../helpers/couponHelper")
const wishlistModel=require("../models/wishListModel")
const offerHelper=require("../helpers/offerHelper")
const wishlistHelper=require("../helpers/wishlistHelper")
const mongoose=require("mongoose")
const getCart=async(req,res,next)=>{
try{
    const userId = req.session.user._id;
    const cartCount = await cartHelper.cartCount(userId);
        const wishlistCount = await wishlistHelper.wishlistCount(userId);
    const userCart=await cartModel.findOne({userId:userId})
    let products = [];
    if(userCart){
        for (let i = 0; i < userCart.items.length; i++) {
          const product = await productModel.findById(
            userCart.items[i].productId
          );
          const size=userCart.items[i].size
          const quantity=userCart.items[i].quantity
           const productWithSize = Object.assign({}, product.toObject(), {
             size: size,
           },{quantity:quantity});
          if (products) {

            products.push(productWithSize);
          }
        }
       
        const items=await offerHelper.checkOfferCart(products)
        const totalPriceOfEachProduct=await cartHelper.individualTotal(items)
      
        const totalPrice=await cartHelper.totalSubtotal(userId,items) 
        await couponHelper.clearCoupon(userId)
         res.render("cart", {
           user: req.session.user,
           cartCount: cartCount,
           products: items,
           userCart: userCart,
           totalPrice: totalPrice,
           totalPriceOfEachProduct: totalPriceOfEachProduct,
           wishlistCount
         });
        


    }else{
        res.render("cart", {
          user: req.session.user,
          cartCount: cartCount,
          products: products,
        });
    }
    
    
  
 
 }
 catch(error){
  next(error)

 }
}
const addTOCart = async (req, res,next) => {
  try {
    if (req.session.user) {
      const productId = req.query.id; // Use descriptive names
      const size = req.query.size;
      const userId = req.session.user._id;
      

      const item = await productModel.findOne({ _id: productId });
          const product=await offerHelper.offerCheckForProduct(item)
      
      const productToAdd = {
        // Use more meaningful names
        productId: productId,
        price: product.salePrice,
        size: size,
      };

      const cart = await cartModel.findOne({ userId: userId });

      if (!cart) {
        await cartModel.create({
          userId: userId,
          items: [productToAdd],
        });
          await wishlistModel.findOneAndUpdate(
            { user: userId },
            { $pull: { products: { product: productId } } }, // Pull the product matching the given ID
            { new: true }
          );
        res.json({ success: true });
      } else {
        // Check if product with same name and size already exists
        const productExist = await cartModel.findOne({
          userId: userId,
          items: {
            $elemMatch: {
              productId: productId,
              size: size,
            },
          },
        });

        if (!productExist) {
          // Push only unique products by including size
          await cartModel.updateOne(
            { userId: userId },
            { $push: { items: productToAdd } }
          );
         await wishlistModel.findOneAndUpdate(
           { user: userId }, 
           { $pull: { products: { product: productId } } }, // Pull the product matching the given ID
           { new: true } 
         );
          res.json({ success: true });
        } else {
           res.json({ success: false });
        }
      }
    } else {
      res.json({ success: false });
    }
  } catch (error) {
   next(error)
  }
};

const productCartCheck=async(req,res,next)=>{
  try{
    const userId=req.session.user._id
     const { size, id: productId } = req.query;

     const productExist = await cartModel.findOne({
       userId: userId,
       items: { $elemMatch: { productId: productId,size:size } },
     });
     
     if(productExist){
    
      res.json({success:true})
      
     }else{
  
      res.json({success:false})
     }

  }
  catch(error){
    next(error)
  }

}
const removeCartItem=async(req,res,next)=>{
  try{
   
  const { id: productid, size } = req.query;

    const userId=req.session.user._id
 
   const result = await cartModel.updateOne(
     { userId: userId },
     { $pull: { items: { productId: productid, size: size } } }
   );

  
  if(result){
    res.json({success:true,proId:productid})
  }
  else{
    res.json({success:false})
  }

  }
  catch(error){
    next(error)

  }

}
const updateCartQuantity=async(req,res)=>{
 
 try{
   const { id: productId, qty: quantity, size } = req.query;

   const userId = req.session.user._id;
   const update = await cartHelper.incOrDecProductQuantity(
     userId,
     productId,
     quantity,
     size
   );
   const userCart = await cartModel.findOne({ userId: userId });
   let products = [];

   for (let i = 0; i < userCart.items.length; i++) {
     const product = await productModel.findById(userCart.items[i].productId);
     const size = userCart.items[i].size;
     const quantity = userCart.items[i].quantity;
     const productWithSize = Object.assign(
       {},
       product.toObject(),
       {
         size: size,
       },
       { quantity: quantity }
     );
     if (products) {
       products.push(productWithSize);
     }
   }
   const individualTotal = update.newQty * update.proPrice;
   const items = await offerHelper.checkOfferCart(products);

   if (update.newQty) {
     const subtotal = await cartHelper.totalSubtotal(userId, items);

     res.json({
       success: true,
       productId: productId,
       size: update.newQty,
       subtotal: subtotal,
       newPrice: individualTotal,
     });
   } else {
     res.json({ success: false });
   }

 }
 catch(error){
  next(error)

 }

}
const updateSubtotal=async(req,res,next)=>{
  try{
    
    
    const userId=req.session.user._id
    const cart = await cartModel.findOne({ userId: userId });
     let total = 0;

     
     for (let i = 0; i < products.length; i++) {
       total = total + products[i].salePrice * products[i].quantity;
     }

     cart.totalAmount = parseFloat(total);
     await cart.save();
    res.json({productTotal:productTotal})

  }
  catch(error){
    next(error)

  }

}
const clearCart=async(req,res,next)=>{
  try{
    const userId=req.query.id
    const cleared=await cartHelper.clearAllCartItems(userId)
    if(cleared){
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
const cartItemSubtotalUpdate=async(req,res,next)=>{
  try{
    const userId = req.session.user._id;
    const userCart=await cartModel.findOne({userId:userId})
    let products = [];
    
        for (let i = 0; i < userCart.items.length; i++) {
          const product = await productModel.findById(
            userCart.items[i].productId
          );
          const size=userCart.items[i].size
          const quantity=userCart.items[i].quantity
           const productWithSize = Object.assign({}, product.toObject(), {
             size: size,
           },{quantity:quantity});
          if (products) {

            products.push(productWithSize);
          }
        }
          const items = await offerHelper.checkOfferCart(products);
        
        const totalPrice = await cartHelper.totalSubtotal(userId, items); 
        if(totalPrice){
          res.json({success:true,subtotal:totalPrice})
        }
        else{
          res.json({ success: false });

        }

  }
  catch(error){
   next(error)
  }
}
module.exports={
    getCart,
    addTOCart,
    productCartCheck,
    removeCartItem,
    updateCartQuantity,
    updateSubtotal,
    clearCart,
    cartItemSubtotalUpdate

}