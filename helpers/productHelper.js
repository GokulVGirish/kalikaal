const productModel=require("../models/productModel")
const reviewModel=require("../models/reviewModel")
const getFilteredProducts=()=>{
    return new Promise(async(resolve,reject)=>{
        try{
             const products = await productModel.aggregate([
               {
                 $lookup: {
                   from: "categories",
                   localField: "category",
                   foreignField: "_id",
                   as: "category",
                 },
               },
               {$unwind:"$category"},
               {
                 $match: {
                   "category.isListed": true,
                   "isBlocked": false,
                 },
               },
             ]);
             resolve(products)
  

        }
        catch(error){
            console.log(error)
        }
          
       
         
    })
}
const getAllReviews = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      const getAllReviews = await reviewModel.find({product:productId}).populate("user")
     
      resolve(getAllReviews);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports={
    getFilteredProducts,
    getAllReviews
}