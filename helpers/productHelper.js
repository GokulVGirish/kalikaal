const productModel=require("../models/productModel")
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
module.exports={
    getFilteredProducts
}