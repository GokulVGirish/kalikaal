const offerModel=require("../models/offerModel")
const offerHelper=require("../helpers/offerHelper")
const productHelper=require("../helpers/productHelper")
const categoryModel=require("../models/categoryModel")
const { findByIdAndDelete } = require("../models/adminModel")
const productOfferPageGet=async(req,res,next)=>{
    try{
       const offers=await offerHelper.getAllOfferOfProducts()
       const products= await productHelper.getFilteredProducts()
       const message = req.flash("message");
       if (message.length > 0) {
       
         res.render("productOfferManagement", {
           offers,
           products,
           message,
         });
       } else {
         res.render("productOfferManagement", { offers, products });
       }



    }
    catch(error){
       next(error)
    }
}
const productAddOffer=async(req,res,next)=>{
    try{
        const offer=await offerHelper.productOfferCreate(req.body)
         if (offer) {
           req.flash("message", "Offer Added");
           res.redirect("/admin/productOffers");
         }
        

    }
    catch(error){
        next(error)
    }
}
const productOfferEditGet=async(req,res,next)=>{
    try{
        const id=req.params.id
        const response= await offerHelper.getSingleOfferDetail(id)
        
         if (response) {
           res.json(response);
         } else {
           res.json({ status: false });
         }


    }
    catch(error){
       next(error)
    }
}
const productOfferEdit=async(req,res,next)=>{
    try{
        const updated=await offerHelper.productOfferEdit(req.body)
        
        if(updated){
              req.flash("message", "Offer edited");
              res.redirect("/admin/productOffers");

        }
        
        

    }
    catch(error){
       next(error)
    }
}

const getCategoryOffer=async(req,res,next)=>{
    try{
        const offers=await offerHelper.getAllofferOfCategory()
         const categories = await categoryModel.find({ isListed: true });
         const message = req.flash("message");
         
         if (message.length > 0) {
       
           res.render("categoryOfferManagement", {
             offers,
             categories,
             message,
           });
         } else {
           res.render("categoryOfferManagement", { offers, categories });
         }


    }
    catch(error){
       next(error)
    }
}
const addCategoryOffer=async(req,res,next)=>{
    try{
        const added= await offerHelper.createCategoryOffer(req.body)
        if (added) {
          req.flash("message", "Offer Added");
          res.redirect("/admin/categoryOffers");
        } 


    }
    catch(error){
      next(error)
    }
}
const categoryOfferEditGet=async(req,res,next)=>{
  try{
    console.log("viliyeey")
    const id=req.params.id
    const response=await offerHelper.getSingleOfferDetail(id)
    console.log(response)
    res.json(response)


  }
  catch(error){
 next(error)
  }
}
const categoryOfferEdit=async(req,res,next)=>{
  try{
    const updated=await offerHelper.categoryOfferEdit(req.body)
    if(updated){
      req.flash("message", "Offer edited");
      res.redirect("/admin/categoryOffers");

    }
    


  }
  catch(error){
   next(error)
  }
}
const deleteOffer=async(req,res,next)=>{
  try{
    const id=req.query.id
    const deleted= await offerModel.findByIdAndDelete({_id:id})
    if(deleted){
      res.json({success:true})
    }else{
      res.json({success:false})
    }

  }
  catch(error){
   next(error)
  }
}

module.exports={
    productOfferPageGet,
    productAddOffer,
    productOfferEditGet,
    productOfferEdit,
    getCategoryOffer,
    addCategoryOffer,
    categoryOfferEditGet,
    categoryOfferEdit,
    categoryOfferEdit,
    deleteOffer
}