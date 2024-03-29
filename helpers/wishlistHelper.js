const productModel=require("../models/productModel")
const wishListModel=require("../models/wishListModel")
const ObjectId=require("mongoose").Types.ObjectId
const wishlistCount=(userId)=>{
  return new Promise(async(resolve,reject)=>{
    try{
      const wishlist=await wishListModel.findOne({user:userId})
      let length
      if(wishlist){
         length=wishlist.products.length
      }else{
        length=0
      }
      resolve(length)

    }
    catch(error){
      console.log(error)

    }
  })
}

const addWishList=(userId,productId,size)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const product=await productModel.findOne({_id:productId})
            const result={}
            if(!product){
                reject(Error("Product Not found"))
            }
           
                const wishlistofuser = await wishListModel.findOne({ user: userId });
             const productExists = wishlistofuser?.products?.some(
               (product) =>
                 product.product.toString() === productId 
             );

                if (productExists) {
                    result.status=false
                    result.message="Product already in wishlist"
                  
                  resolve(result);
                  return;
                }
            const wishlist= await wishListModel.updateOne({
                user:userId
            },{
                $push:{products:{product:productId}}
            },{
                upsert:true

            })
             result.status = true;
             result.message = "Added to wishlist";
              console.log("result", result);
             resolve(result);
            


        }
        catch(error){
            console.log(error)
        }
    })
}
const getAllWishlistProducts=(userId)=>{
return new Promise(async(resolve,reject)=>{
        try {
            let products = await wishListModel.aggregate([
              {
                $match: {
                  user: new ObjectId(userId),
                },
              },
              {
                $unwind: "$products",
              },
              {
                $project: {
                  items: "$products.product",
                },
              },
              {
                $lookup: {
                  from: "products",
                  localField: "items",
                  foreignField: "_id",
                  as: "item",
                },
              },
              {
                $unwind:"$item"
              }
            ]);
            resolve(products)


        } catch (error) {
          console.log(error);
        }

})
}
module.exports={
    addWishList,
    getAllWishlistProducts,
    wishlistCount
}