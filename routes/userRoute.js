const express = require('express')
const router = express.Router()
const userController=require("../controllers/userController")

router.get("/",userController.loginload);
router.post('/',userController.logUser)
router.get("/signup",userController.loadregister)






module.exports=router