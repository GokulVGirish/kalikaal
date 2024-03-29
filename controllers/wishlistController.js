const cartHelper=require("../helpers/cartHelper")
const wishlistModel=require("../models/wishListModel")
const wishlistHelper=require("../helpers/wishlistHelper")
const offerHelper=require("../helpers/offerHelper")

const getWishList=async(req,res,next)=>{
    try{
        const user=req.session.user
        const userId = req.session.user._id;
        
    const cartCount = await cartHelper.cartCount(userId);
        const wishlistCount = await wishlistHelper.wishlistCount(userId);
    const wishlistItems=await wishlistHelper.getAllWishlistProducts(userId)
  
   
     const items=await offerHelper.checkOfferwishlist(wishlistItems)
   
 
       
  
    res.render("wishlist",{user:user,cartCount,items:items,wishlistCount})

    }
    catch(error){
       next(error)
    }
}
 const addWishList=async(req,res,next)=>{
    try{
        const productId=req.query.id
        
         const userId=req.session.user._id
         const result= await wishlistHelper.addWishList(userId,productId)
         
         if(result.status){
            res.json({success:true,wishlistMessage:result.message})
         }else{
            res.json({success:false,wishlistMessage:result.message})
         }
       
    }
    catch(error){
       next(error)
    }
}
const removeWIshList=async(req,res,next)=>{
    try{
        const productId=req.query.id
        const userId=req.session.user._id
        const result=await wishlistModel.updateOne({user:userId},{$pull:{products:{product:productId}}})
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
module.exports = {
  getWishList,
  addWishList,
  removeWIshList
};