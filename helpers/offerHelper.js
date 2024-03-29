const { off } = require("../models/adminModel")
const offermodel=require("../models/offerModel")

const getAllOfferOfProducts=()=>{
    return new Promise(async(resolve,reject)=>{
        try{
             const offers = await offermodel
               .find({ "productOffer.offerStatus": true }).populate("productOffer.product")
              
              if(offers){
                resolve(offers)
              }



        }
        catch(error){
            console.log(error)
        }
    })

}
const productOfferCreate=(data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const offer = offermodel.create({
              offerName: data.offerName,
              startingDate: data.startDate,
              endingDate: data.endDate,
              "productOffer.product": data.productName,
              "productOffer.discount": data.discountAmount,
              "productOffer.offerStatus": true,
            });
            resolve(offer)


        }
        catch(error){
            console.log(error)
        }
    })
}
const getSingleOfferDetail=(id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result=await offermodel.findOne({ _id: id }).lean()
             result.formattedStartingDate = formatDate(
               result.startingDate
             );
             result.formattedEndingDate = formatDate(
               result.endingDate
             );
            resolve(result)



        }
        catch(error){
            console.log(error)
        }
    })
}

const productOfferEdit=(data)=>{
    return new Promise(async(resolve,reject)=>{
        try{

            const updated = await offermodel.updateOne(
              { _id: data.offerId },
              {
                $set: {
                  offerName: data.offerName,
                  startingDate: data.startDate,
                  endingDate: data.endDate,
                  "productOffer.product": data.productName,
                  "productOffer.discount": data.discountAmount,
                  "productOffer.offerStatus": true,
                },
              }
            );
            if(updated){
                resolve(updated)
            }



        }
        catch(error){
            console.log(error)
        }
    })
}
const getAllofferOfCategory=()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const offer = await offermodel
              .find({ "categoryOffer.offerStatus": true })
              .populate("categoryOffer.category");
              if(offer){
                resolve(offer)
              }

        }
        catch(error){
            console.log(error)
        }
    })

}
const createCategoryOffer=(data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
              const result = await offermodel.create({
        offerName: data.offerName,
        startingDate: data.startDate,
        endingDate: data.endDate,
        "categoryOffer.category": data.categoryName,
        "categoryOffer.discount": data.discountAmount,
        "categoryOffer.offerStatus": true,
      });
      resolve(result);


        }
        catch(error){
            console.log(error)
        }
    })
}
const categoryOfferEdit=(data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await offermodel.updateOne(
              { _id: data.offerId },
              {
                $set: {
                  offerName: data.offerName,
                  startingDate: data.startDate,
                  endingDate: data.endDate,
                  "categoryOffer.category": data.categoryName,
                  "categoryOffer.discount": data.discountAmount,
                  "categoryOffer.offerStatus": true,
                },
              }
            );
            resolve(result)

        }
        catch(error){
            console.log(error)
        }
    })
}
const findOffer=(products)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const currentDate= new Date()
            const offer= await getActiveOffer(currentDate)
           
            for(let i=0;i<products.length;i++){
                const productOffer=offer.find((item)=>{
                    
                    return item.productOffer?.product?.toString()===products[i]._id.toString()
                })
             
                const categoryOffer=offer.find((item)=>{
                  
                    return item.categoryOffer?.category?.toString()===products[i].category._id.toString()
                })
              
                if(productOffer!=undefined&&categoryOffer!=undefined){
                    if (
                      productOffer.productOffer.discount >
                      categoryOffer.categoryOffer.discount
                    ) {
                      products[i].salePrice = Math.round(
                        products[i].regularPrice -
                          (products[i].regularPrice *
                            productOffer.productOffer.discount) /
                            100
                      );
                    } else {
                      products[i].salePrice = Math.round(
                        products[i].regularPrice -
                          (products[i].regularPrice *
                            categoryOffer.categoryOffer.discount) /
                            100
                      );
                    }

                }else if(productOffer!=undefined){
                      products[i].salePrice = Math.round(
                        products[i].regularPrice -
                          (products[i].regularPrice *
                            productOffer.productOffer.discount) /
                            100
                      );



                }else if(categoryOffer!=undefined){
                      products[i].salePrice = Math.round(
                        products[i].regularPrice -
                          (products[i].regularPrice *
                            categoryOffer.categoryOffer.discount) /
                            100
                      );

                }
                else{
                    products[i].salePrice = Math.round(
                      products[i].regularPrice -
                        (products[i].regularPrice *
                          products[i].discount) /
                          100
                    );

                }

            }
            resolve(products)
            



        }
        catch(error){
            console.log(error)
        }

    })
}
const checkOfferCart=(products)=>{
  return new Promise(async(resolve,reject)=>{
    try{
        const currentDate = new Date();
      const offer = await getActiveOffer(currentDate);
      for(let i=0;i<products.length;i++){
        const productOffer=offer.find((item)=>{
          return item.productOffer?.product?.toString()===products[i]._id.toString()
        })
        const categoryOffer=offer.find((item)=>{
          return item.categoryOffer?.category?.toString()===products[i].category.toString()
        })
        if (productOffer != undefined && categoryOffer != undefined) {
          if( productOffer.productOffer.discount >
            categoryOffer.categoryOffer.discount){
              products[i].salePrice = Math.round(
                products[i].regularPrice -
                  (products[i].regularPrice *
                    productOffer.productOffer.discount) /
                    100
              );

              
            }else{
                products[i].salePrice = Math.round(
                  products[i].regularPrice -
                    (products[i].regularPrice *
                      categoryOffer.categoryOffer.discount) /
                      100
                );

            }

        }else if (productOffer != undefined) {
              products[i].salePrice = Math.round(
                products[i].regularPrice -
                  (products[i].regularPrice *
                    productOffer.productOffer.discount) /
                    100
              );

        } else if (categoryOffer != undefined) {
            products[i].salePrice = Math.round(
              products[i].regularPrice -
                (products[i].regularPrice *
                  categoryOffer.categoryOffer.discount) /
                  100
            );

        } else {
            products[i].salePrice = Math.round(
              products[i].regularPrice -
                (products[i].regularPrice * products[i].discount) / 100
            );

        }

      }
      resolve(products)



    }
    catch(error){
      console.log(error)
    }
  })

}
const checkOfferwishlist=(products)=>{
  return new Promise(async(resolve,reject)=>{
    try{
        const currentDate = new Date();
      const offer = await getActiveOffer(currentDate);
      for(let i=0;i<products.length;i++){
        const productOffer=offer.find((item)=>{
          return item.productOffer?.product?.toString()===products[i].item._id.toString()
        })
        const categoryOffer=offer.find((item)=>{
          return item.categoryOffer?.category?.toString()===products[i].item.category.toString()
        })
        if (productOffer != undefined && categoryOffer != undefined) {
          if( productOffer.productOffer.discount >
            categoryOffer.categoryOffer.discount){
              products[i].item.salePrice = Math.round(
                products[i].item.regularPrice -
                  (products[i].item.regularPrice *
                    productOffer.productOffer.discount) /
                    100
              );

              
            }else{
                products[i].item.salePrice = Math.round(
                  products[i].item.regularPrice -
                    (products[i].item.regularPrice *
                      categoryOffer.categoryOffer.discount) /
                      100
                );

            }

        }else if (productOffer != undefined) {
              products[i].item.salePrice = Math.round(
                products[i].item.regularPrice -
                  (products[i].item.regularPrice *
                    productOffer.productOffer.discount) /
                    100
              );

        } else if (categoryOffer != undefined) {
            products[i].item.salePrice = Math.round(
              products[i].item.regularPrice -
                (products[i].item.regularPrice *
                  categoryOffer.categoryOffer.discount) /
                  100
            );

        } else {
            products[i].item.salePrice = Math.round(
              products[i].item.regularPrice -
                (products[i].item.regularPrice * products[i].item.discount) / 100
            );
           

        }

      }
      resolve(products)



    }
    catch(error){
      console.log(error)
    }
  })

}
const offerCheckForProduct=(product)=>{
  return new Promise(async(resolve,reject)=>{
    try{
         const currentDate = new Date();
         const offer = await getActiveOffer(currentDate);
           const productOffer = offer.find(
             (item) => item.productOffer?.product?.toString() == product._id.toString()
           );
           const categoryOffer = offer.find(
             (item) =>
               item.categoryOffer?.category?.toString() ==
               product.category.toString()
           );
           if(productOffer!=undefined&&categoryOffer != undefined){
            if(productOffer.productOffer.discount >
          categoryOffer.categoryOffer.discount){
             product.salePrice = Math.round(
               product.regularPrice -
                 (product.regularPrice *
                   productOffer.productOffer.discount) /
                   100
             );

          }
          else{
            product.salePrice = Math.round(
              product.regularPrice -
                (product.regularPrice * categoryOffer.categoryOffer.discount) /
                  100
            );


          }

           }
           else if (productOffer != undefined) {
               product.salePrice = Math.round(
                 product.regularPrice -
                   (product.regularPrice * productOffer.productOffer.discount) /
                     100
               );
           }
           else if (categoryOffer != undefined) {
              product.salePrice = Math.round(
                product.regularPrice -
                  (product.regularPrice *
                    categoryOffer.categoryOffer.discount) /
                    100
              );


           }
           else{
             product.salePrice = Math.round(
               product.regularPrice -
                 (product.regularPrice * product.discount) /
                   100
             );

           }
           resolve(product)



    }
    catch(error){
      console.log(error)
    }

  })
}
const getActiveOffer=async(currentDate)=>{
   return new Promise(async(resolve,reject)=>{
     try{
         const result = await offermodel.find({
           startingDate: { $lte: currentDate },
           endingDate: { $gte: currentDate },
           status: true,
         });
         resolve(result)
            

    }
    catch(error){
        console.log(error)
    }
   })
}

function formatDate(dateString) {
  // Create a Date object from the string
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

module.exports={
    getAllOfferOfProducts,
    productOfferCreate,
    getSingleOfferDetail,
    productOfferEdit,
    getAllofferOfCategory,
    createCategoryOffer,
    categoryOfferEdit,
    findOffer,
    checkOfferCart,
    offerCheckForProduct,
    checkOfferwishlist

}