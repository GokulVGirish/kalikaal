const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const cartController=require("../controllers/cartController")
const checkoutController=require("../controllers/checkoutController")
const {isLogged}=require("../middlewares/userAuth")
const profileController=require("../controllers/profileController")
const wishlistController=require("../controllers/wishlistController")
const couponController=require("../controllers/couponController")
const orderController=require("../controllers/ordersController")

router.get("/",userController.guestUser)

router.get("/login",userController.loginload);
router.post("/login", userController.logUser);

router.get("/signup", userController.loadregister);
router.post("/signup", userController.insertUser);
router.get("/userhome", userController.userHome);
router.get("/user-logout", userController.userLogout);
router.post("/sendotp/:id", userController.sentOtp);
router.post("/verifyotp", userController.verifyOtp);
router.get("/forgotPassword",userController.forgotPasswordGet)
router.post("/forgotPassword",userController.passwordResetOtpPage)
router.post("/resetPasswordOtpVerify",userController.passwordResetOtpVerify)
router.post("/changePassword",userController.changePassword);



//productbasedroutes
router.get("/productdetails",userController.getProductDetailsPage)
router.post("/quantity",isLogged,userController.loadQuantity)

router.get("/cart",isLogged,cartController.getCart)
router.post("/addcart",cartController.addTOCart)
router.get("/productcartcheck",cartController.productCartCheck);
router.patch("/removecartitem",cartController.removeCartItem);
router.patch("/updatecartquantity",cartController.updateCartQuantity);
router.get("/updatesubtotal",cartController.updateSubtotal);
router.delete("/clearcart",cartController.clearCart)
router.get("/cartitemsubtotalupdate", cartController.cartItemSubtotalUpdate);

//profile
router.get("/userprofile",profileController.loadProfile)
router.post("/addaddress",profileController.addAddress)
router.get("/editaddress",profileController.getEditAddress)
router.put("/editaddress",profileController.editAddress)
router.post("/edituserinfo",profileController.editUserInfo)
router.post("/edituserpassword",profileController.editUserPassword)
router.patch("/deleteaddress",profileController.deleteAddress)
router.get("/orderdetails/:id", profileController.getOrderDetailsPage);
router.patch("/cancelorder",profileController.cancelOrder)
router.patch("/cancelsingleorder",profileController.CancelSingleOrder);
router.patch("/returnorder",profileController.returnOrder);
router.get("/sendemailotp",profileController.sendEmailOtp);
router.post("/editemail",profileController.changeEmail);

//checkout
router.get("/checkout",checkoutController.loadCheckOut)
router.post("/placeorder",checkoutController.placeOrder)
router.get("/ordersuccesspage",checkoutController.ordererSuccessPage);

router.get("/shop",userController.getShopPage)
router.get("/search",userController.searchProducts)
router.get("/filter",userController.filterProducts)
router.get("/filterPrice",userController.filterProductsByPrice)
router.post("/sortProducts",userController.sortProducts);

router.post("/addreview",userController.addReview);
router.get("/usercheck",userController.userCkeck);
router.get("/ratingfilter",userController.ratingFilter)
router.get("/newarrivals",userController.newArrivals);

router.get("/wishlist",wishlistController.getWishList)
router.post("/wishlist",wishlistController.addWishList)
router.delete("/removeWishlist",wishlistController.removeWIshList);
router.patch("/setDefaultAddress",profileController.setDefaultAddress);
router.post("/applyCoupon",couponController.applyCoupon);

router.post("/verify-payment",orderController.verifyPayment);

router.patch("/clearCoupon",couponController.clearCoupon);
router.post("/add-money-to-wallet",profileController.addMoneyTOWallet)
router.post("/wallet-verify-payment",profileController.verifyPaymentToWallet)







module.exports = router;
