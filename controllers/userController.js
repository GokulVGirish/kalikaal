const userModel = require("../models/userModel");
const userHelper = require("../helpers/userHelper");
const orderModel=require("../models/orderModel")
const productModel=require("../models/productModel")
const productHelper=require("../helpers/productHelper")
const cartModel=require("../models/cartModel")
const cartHelper=require("../helpers/cartHelper")
const otpHelper=require("../helpers/otpHelper");
const brandModel = require("../models/brandModel");
const categotyModel=require("../models/categoryModel")
const reviewModel=require("../models/reviewModel")
const offerHelper=require("../helpers/offerHelper")
const bcrypt=require("bcrypt")
const wishlistHelper=require("../helpers/wishlistHelper")



const userCkeck=(req,res,next)=>{
  try{
    if(req.session.user){
      res.json({success:true})
    }
    else{
       res.json({ success: false });

    }

  }
  catch(error){
   next(error)
  }
}

const sentOtp = async (req, res,next) => {

  console.log("request come to send the otp");
  try {
    const email = req.params.id;
    req.session.email=email
   
    const otp = await otpHelper.generateOtp(email)
    req.session.otpCreationTime = Date.now();
    req.session.otpExpiryTime = Date.now() + 60 * 1000;
  
    const userEmail = email;

    if (!userEmail) {
      return res
        .status(400)
        .json({ error: "Invalid or missing email address" });
    }
    
    req.session.otp = otp;
    res.json({ message: "OTP Send To Your Email" });
  } catch (error) {
  
 next(error)
  }
};
const verifyOtp = (req, res,next) => {
  try{
    const sendedOtp = req.session.otp;
    const verifyOtp = req.body.otp;

    if (sendedOtp === verifyOtp) {
      if (Date.now() < req.session.otpExpiryTime) {
       
        req.session.otpmatched = true;
        res.json({ status: true, message: "Success" });
      } else {
        req.session.otpmatched = false;
        res.json({ status: false, message: "failed" });
      }
    } else {
      req.session.otpmatched = false;
      res.json({ status: false, message: "failed" });
    }

  }
  catch(error){
  next(error)
  }
};

const loadregister = (req, res,next) => {
 try{

   if (req.session.user) {
     res.redirect("userhome");
   } else {
     res.render("signup");
   }
 }
 catch(error){
next(error)

  
 }
};
const loginload = (req, res,next) => {
  
 try{
   if (req.session.user) {
     res.redirect("userhome");
   } else {
     const message = req.flash("message");

     res.render("login", { message: message });
   }

 }
 catch(error){
 next(error)
 }
};
const logUser = async (req, res,next) => {
 try{
   await userHelper.doLogin(req.body).then((response) => {
     if (response.loggedIn) {
       req.session.user = response.user;
       //  return res.status(202).json({error:false,message:response.logginMessage})
       res.redirect("userhome");
     } else {
       res.render("login", { message: response.logginMessage });
     }
   });

 }
 catch(error){
 next(error)
 }
};
const insertUser = async (req, res,next) => {
  try{
    const { otpmatched, email } = req.session;

    const response = await userHelper.doSignup(
      req.body,
      otpmatched,
      email
    );
   if(req.body.referal){
     await userHelper.refferalOfferApply(response.user._id, req.body.referal);
   }
    if (response.status) {
      req.flash("message", response.message);
      res.redirect("/login");
    } else {
      res.render("signup", { message: response.message });
    }

  }
  catch(error){
   next(error)

  }
};
const forgotPasswordGet=(req,res,next)=>{
  try{
    const message=req.flash("message")
    res.render("forgotPassword",{message})

  }
  catch(error){
 next(error)
  }
}
const passwordResetOtpPage=async(req,res,next)=>{
  try{
    const email=req.body.email
    const user= await userModel.findOne({email:email})
    if(user){
       const otp = await otpHelper.generateOtp(email);
       console.log("reset password otp",otp)
       req.session.otp=otp
       req.session.otpExpiryTime = Date.now() + 60 * 1000;
       res.render("otpVerify",{email})

    }else{
      req.flash("message","This user dosent exist")
      res.redirect("/forgotPassword")
    }
    
  }catch(error){
   next(error)
  }
}
const passwordResetOtpVerify=(req,res,next)=>{
  try{
     const sendedOtp = req.session.otp;
     const verifyOtp = req.body.otp;
     const email=req.body.email
     if(sendedOtp===verifyOtp && Date.now() < req.session.otpExpiryTime){
      res.render("passwordResetPage",{email})

     }else{
        req.flash("message", "otp is invalid");
        res.redirect("/forgotPassword");

     }


  }
  catch(error){
   next(error)
  }
}
const changePassword=async(req,res,next)=>{

  try{
   const {password,email}=req.body
   const user=await userModel.findOne({email:email})
 user.password = await bcrypt.hash(password, 10);
 await user.save()
    req.flash("message", "password changed sucessfully");
 res.redirect("/login")

  }
  catch(error){
  next(error)
  }
}
const userHome = async (req, res,next) => {
  if (req.session.user) {
    const userId=req.session.user._id
    const cartCount = await cartHelper.cartCount(userId);
    const wishlistCount=await wishlistHelper.wishlistCount(userId)
   try{ 
    const productList = await productHelper.getFilteredProducts()
      const products = await offerHelper.findOffer(productList);

 
   res.render("userhome", { productList: products,user:req.session.user,cartCount:cartCount,wishlistCount });
    
   }
   catch(error){
  next(error)

   }
  } else {
    res.redirect("/");
  }
};
const userLogout = (req, res,next) => {
  try {
    
    req.session.user = null;
    res.redirect("/");
  } catch (error) {
   next(error)
  }
};
const getProductDetailsPage=async(req,res,next)=>{
  try{
    const id = req.query.id;
    const message=req.query.message?req.query.message:undefined
   
 
   const item = await productModel
     .findOne({ _id: id })
     
     const findProduct = await offerHelper.offerCheckForProduct(item);
  
      

  if(req.session.user){
     const userId = req.session.user._id;
     const cartCount=await cartHelper.cartCount(userId)
         const wishlistCount = await wishlistHelper.wishlistCount(userId);

     const reviews = await productHelper.getAllReviews(id);
       const productExistInCart = await cartModel.findOne({
         userId: userId,
         items: { $elemMatch: { productId: id } },
       });
    
       
 
       res.render("product-view", {
         data: findProduct,
         user: req.session.user,
         productInCart: productExistInCart,
         cartCount:cartCount,
         reviews:reviews,
         message,
         wishlistCount
       });
  }else{
    const reviews = await productHelper.getAllReviews(id);
    res.render("product-view", { data: findProduct, user: req.session.user,reviews });
  }
    

  }
  catch(error){
  next(error)

  }

}
const loadQuantity=async(req,res,next)=>{
  try{
   
     const { id, size: prosize } = req.query;

    
   
    const product=await productModel.findOne({_id:id})
    
    const quantity={
      's':product.size.s.quantity,
      'm':product.size.m.quantity,
      'l':product.size.l.quantity
      
    }
    const sendsize=quantity[prosize]
    
    res.json({message:sendsize,productId:id})

  }
  catch(error){
 next(error)

  }
}
const guestUser=async(req,res,next)=>{
 try{
  
   const productList = await productHelper.getFilteredProducts();
 const products = await offerHelper.findOffer(productList);
 res.render("userhome", { productList: products,user:req.session.user });

 }
 catch(error){
next(error)

 }


}
const getShopPage=async(req,res,next)=>{
  try{
   
    const userId = req.session.user ? req.session.user._id : undefined;
    const user=req.session.user
     const productsFiltered = await productHelper.getFilteredProducts();
      const products = await offerHelper.findOffer(productsFiltered);

    const count = await productModel.find({ isBlocked: false }).count();
    const brands=await brandModel.find({})
     const cartCount = await cartHelper.cartCount(userId);
         const wishlistCount = await wishlistHelper.wishlistCount(userId);
    const categories=await  categotyModel.find({isListed:true})
      let itemsPerPage = 6;
      let currentPage = parseInt(req.query.page) || 1;
      let startIndex = (currentPage - 1) * itemsPerPage;
      let endIndex = startIndex + itemsPerPage;
      let totalPages = Math.ceil(products.length / 6);
      
      
      const currentProduct = products.slice(startIndex, endIndex);
      res.render("shop", {
      
        product: currentProduct,
        allproducts:products,
        category: categories,
        brand: brands,
        count: count,
        totalPages,
        currentPage,
        user,
        baseRoute: "/shop",
        
        cartCount,
        wishlistCount
      });


  }
  catch(error){
  next(error)
  }
}
const searchProducts=async(req,res,next)=>{
  try{
     const userId = req.session.user ? req.session.user._id : undefined;
     const user = req.session.user;
     
     let search = req.query.search;
      const cartCount = await cartHelper.cartCount(userId);
          const wishlistCount = await wishlistHelper.wishlistCount(userId);
      const brands=await brandModel.find({})
    const categories=await  categotyModel.find({isListed:true})
    const products = await productModel
      .find({
        $or: [
          {
            productName: { $regex: ".*" + search + ".*", $options: "i" },
          },
        ],
        isBlocked: false,
      })
      .populate("category")
      .lean();
       const searchResult = await offerHelper.findOffer(products);

   
     let itemsPerPage = 6;
     let currentPage = parseInt(req.query.page) || 1;
     let startIndex = (currentPage - 1) * itemsPerPage;
     let endIndex = startIndex + itemsPerPage;
     let totalPages = Math.ceil(searchResult.length / 6);
     const currentProduct = searchResult.slice(startIndex, endIndex);
    res.render("shop", {
      product: currentProduct,
      category: categories,
      brand: brands,
        allproducts:searchResult,

      totalPages,
      currentPage,
      user,
      baseRoute: "/search",

      cartCount,
      wishlistCount
    });


  }
  catch(error){
  next(error)
  }
}
const filterProducts=async(req,res,next)=>{
  try{
    
   
    const { category, brand } = req.query;

   
    const user = req.session.user;
    const userId = req.session.user ? req.session.user._id : undefined;
     const cartCount = await cartHelper.cartCount(userId);
         const wishlistCount = await wishlistHelper.wishlistCount(userId);
    let findCategory = null;
  
    if(category){
     

       findCategory = await categotyModel.findOne({ _id: category })
         
    }
    const  findBrand=brand?await brandModel.findOne({_id:brand}):null
   
    const query={
      isBlocked:false
    }
    if(findCategory){
      query.category=findCategory._id
    }
    if(findBrand){
      query.brand=findBrand._id
    }
    
    const products=await productModel.find(query).populate("brand").populate("category")
      const findProducts = await offerHelper.findOffer(products);
    const categories=await categotyModel.find({isListed:true})
    const brands=await brandModel.find({})
    let itemsPerPage = 6;
    let currentPage = parseInt(req.query.page) || 1;
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let totalPages = Math.ceil(findProducts.length / 6);
    const currentProduct = findProducts.slice(startIndex, endIndex);

    res.render("shop", {
      product: currentProduct,
      category: categories,
      brand: brands,
      totalPages,
      currentPage,
      selectedCategory: category || null,
      selectedBrand: brand || null,
      user,
      baseRoute: "/filter",
      allproducts:findProducts,

      cartCount,
      wishlistCount
    });


  }
  catch(error){
next(error)
  }
}
const filterProductsByPrice=async(req,res,next)=>{
  try{
   
    const brands=await brandModel.find({})
    const userId = req.session.user ? req.session.user._id : undefined;
    const user = req.session.user;
     const cartCount = await cartHelper.cartCount(userId);
         const wishlistCount = await wishlistHelper.wishlistCount(userId);
    const categories=await categotyModel.find({isListed:true})
    
   
    const products = await productModel.find({}).populate("brand").populate("category")
  const searchResult = await offerHelper.findOffer(products);
  const gt = parseFloat(req.query.gt);
  const lt = parseFloat(req.query.lt);

  const filteredResults = searchResult.filter((item) => {
    return item.salePrice > gt && item.salePrice < lt;
  });
     
      
     let itemsPerPage = 6;
     let currentPage = parseInt(req.query.page) || 1;
     let startIndex = (currentPage - 1) * itemsPerPage;
     let endIndex = startIndex + itemsPerPage;
     let totalPages = Math.ceil(filteredResults.length / 6);
     const currentProduct = filteredResults.slice(startIndex, endIndex);

     res.render("shop", {
       product: currentProduct,
       category: categories,
       brand: brands,
       totalPages,
       currentPage,
       user,
       baseRoute: "/filterPrice",
       allproducts: searchResult,

       cartCount,
       wishlistCount
     });

  }
  catch(error){
  next(error)
  }
}
const sortProducts=async(req,res,next)=>{
  try{
        
        let condition
        if(req.query.condition===undefined){
          condition = req.query.condi

        }
        else{

         condition = req.query.condition;

        }
       
      
      let data;

      if (req.body.productdata === undefined) {
        data = JSON.parse(req.body.pagenationProduct);
      } else {
        data = JSON.parse(req.body.productdata);
      }
      
     let result = await offerHelper.findOffer(data);
       
      
    
  
  
   const userId = req.session.user ? req.session.user._id : undefined;
   const user = req.session.user;
    
    const cartCount = await cartHelper.cartCount(userId);
        const wishlistCount = await wishlistHelper.wishlistCount(userId);
   
     
    
    let products
    if (condition == "lowToHigh") {
      products = result.sort((a, b) => {
        return a.salePrice - b.salePrice;
      });
      
    } else if (condition == "highToLow") {
       products = result.sort((a, b) => {
         return b.salePrice - a.salePrice;
       });
     
    } else if (condition === "releaseDate") {
        products = result.sort((a, b) => {
          return b.createdOn - a.createdOn;
        });
      
    }else if(condition==="aAtozZ"){
      products = result.sort((a, b) => {
        const nameA = a.productName.toUpperCase(); // ignore upper and lowercase
        const nameB = b.productName.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });


    }
    else if (condition==="zZtoaA") {
      products = result.sort((a, b) => {
        const nameA = a.productName.toUpperCase();
        const nameB = b.productName.toUpperCase();
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
    }
    
  
    const categories = await categotyModel.find({ isListed: true });
    const brands = await brandModel.find({});
    let itemsPerPage = 6;
    let currentPage = parseInt(req.body.page) || 1;
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let totalPages = Math.ceil(products.length / 6);
    const currentProduct = products.slice(startIndex, endIndex);
   
 
  res.render("shop", {
    product: currentProduct,
    allproducts: data,
    category: categories,
    brand: brands,
    totalPages,
    currentPage,
    user,
    baseRoute: "/sortProducts",
    sortpage: "sortpage",
    condition:condition,

    cartCount,
    wishlistCount
  });

  }
  catch(error){
  next(error)
  }

}
const ratingFilter=async(req,res,next)=>{
  try{
    const gt = parseInt(req.query.gt);
    const lt = parseInt(req.query.lt);
  
   const user = req.session.user;
    const userId = req.session.user ? req.session.user._id : undefined;
     const cartCount = await cartHelper.cartCount(userId);
         const wishlistCount = await wishlistHelper.wishlistCount(userId);
     const brands = await brandModel.find({});
     const categories = await categotyModel.find({ isListed: true });
     const avgRatings = await reviewModel.aggregate([
      { $group: { _id: '$product', avgRating: { $avg: '$rating' } } },
      { 
        $match: { 
          avgRating: { 
            $gt: gt || Number.MIN_SAFE_INTEGER, 
            $lt: lt || Number.MAX_SAFE_INTEGER, 
          } 
        } 
      }
    ])
   
 const items=[]
   for(let i=0;i<avgRatings.length;i++){
    const product=await productModel.findOne({_id:avgRatings[i]._id})
    items.push(product)
   }
    let products = await offerHelper.findOffer(items);
       
 
   let itemsPerPage = 6;
   let currentPage = parseInt(req.query.page) || 1;
   let startIndex = (currentPage - 1) * itemsPerPage;
   let endIndex = startIndex + itemsPerPage;
   let totalPages = Math.ceil(products.length / 6);
   const currentProduct = products.slice(startIndex, endIndex);
  

   res.render("shop", {
     product: currentProduct,
     category: categories,
     allproducts:products,
     brand: brands,
     totalPages,
     currentPage,
     user,
     baseRoute: "/ratingfilter",

     cartCount,
     wishlistCount
   });





 

  }
  catch(error){
   next(error)
  }
}
const addReview=async(req,res,next)=>{
  try{
   
      const id = req.query.id;
      const userId = req.session.user._id;
     
      const rating = parseInt(req.body.rating);

      const text = req.body.reviewText;
     
      const exist=await reviewModel.findOne({user:userId,product:id})
      const hasPurchased = await orderModel.exists({
        user:userId,
        "products.product": id,
      });
      if(exist){
        res.json({success:false,id:id,message:"review already added"})
        return
      }
      if(hasPurchased){
          await reviewModel.create({
            user: userId,
            product: id,
            rating: rating,
            reviewText: text,
          });
           res.json({ success: true, id: id ,message:"review added sucessfully"});
      

      }else{
        res.json({
          success: false,
          id: id,
          message: "You need to purchase to add review",
        });

      }
      
      
     

    
    

  }
  catch(error){
  next(error)
  }
}
const newArrivals=async(req,res,next)=>{
  try{
  const user = req.session.user;
  const userId = req.session.user ? req.session.user._id : undefined;
   const cartCount = await cartHelper.cartCount(userId);
       const wishlistCount = await wishlistHelper.wishlistCount(userId);
const items = await productModel.find({}).sort({createdOn:1});
 const products = await offerHelper.findOffer(items);
       




    let itemsPerPage = 6;
    let currentPage = parseInt(req.query.page) || 1;
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let totalPages = Math.ceil(products.length / 6);
    const currentProduct = products.slice(startIndex, endIndex);
    res.render("newarrivals", {
      product: currentProduct,

      totalPages,
      currentPage,
      user,
      

      cartCount,
      wishlistCount
    });





  }
  catch(error){
   next(error)
  }
}


module.exports = {
  loginload,
  loadregister,
  logUser,
  insertUser,
  userHome,
  userLogout,
  sentOtp,
  verifyOtp,
  getProductDetailsPage,
  loadQuantity,
  guestUser,
  getShopPage,
  searchProducts,
  filterProducts,
  filterProductsByPrice,
  sortProducts,
  addReview,
  userCkeck,
  ratingFilter,
  newArrivals,
  forgotPasswordGet,
  passwordResetOtpPage,
  passwordResetOtpVerify,
  changePassword
};
