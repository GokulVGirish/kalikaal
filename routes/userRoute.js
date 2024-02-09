const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {isLogged}=require("../middlewares/userAuth")

router.get("/",userController.loginload);
router.post("/", userController.logUser);










router.get("/signup", userController.loadregister);
router.post("/signup", userController.insertUser);
router.get("/userhome", userController.userHome);
router.get("/user-logout", userController.userLogout);
router.post("/sendotp/:id", userController.sentOtp);
router.post("/verifyotp", userController.verifyOtp);



//productbasedroutes
router.get("/productdetails",isLogged,userController.getProductDetailsPage)
router.post("/quantity",isLogged,userController.loadQuantity)




module.exports = router;
