const express = require("express");
const router = express.Router();
const {isAdmin}=require("../middlewares/adminAuth");
const adminController=require("../controllers/adminController");
const customerController=require("../controllers/customerController")
const productController=require("../controllers/productController")
const categoryController=require("../controllers/categoryController")
const ordersController=require("../controllers/ordersController")
const couponController=require("../controllers/couponController")
const salesController=require("../controllers/salesReportController")
const offerController=require("../controllers/offerController")



//admin actions
router.get("/",adminController.loginload)
router.post("/",adminController.logAdmin)
router.get("/admindash",isAdmin,adminController.adminDash)
router.get("/admin-logout", isAdmin,adminController.adminLogout);

//customer Management
router.get("/customerlist",isAdmin,customerController.customerList)
router.patch("/blockcustomer",isAdmin,customerController.customerBlock)
router.patch("/unblockcustomer",isAdmin,customerController.customerUnblock)

//multer settings

const upload=require("../middlewares/multer")
// router.use("/public/uploads",express.static("/public/uploads"))


//products
router.get("/products",isAdmin,productController.getAllProduct)
router.get("/productadd",isAdmin,productController.getProductAddPage)
router.post("/productadd",isAdmin,upload.array("images",4),productController.addProduct)
router.patch("/blockproduct",isAdmin,productController.blockProduct)
router.patch("/unblockproduct",isAdmin,productController.unblockProduct)
router.get("/editproduct",isAdmin,productController.getEditProduct)
router.put("/editproduct/:id",isAdmin,upload.array("images",4),productController.editProduct)
router.patch("/deleteImage",productController.deleteImage);


//category
router.get("/category",isAdmin,categoryController.getCategory)
router.patch("/blockcategory",isAdmin,categoryController.blockCategory)
router.patch("/unblockcategory",isAdmin,categoryController.unblockCategory)
router.get("/categoryadd",isAdmin,categoryController.addCategoryGet)
router.post("/categoryadd",isAdmin,categoryController.addCategory)
router.get("/editcategory",isAdmin,categoryController.editCategoryGet)
router.put("/editcategory/:id",isAdmin,categoryController.editCategory)

router.get("/orders",ordersController.adminOrdersListGet)
router.patch("/orderstatuschange",ordersController.adminOrderStatusChange);
router.patch("/orderstatuschangeforeachproduct/:orderId/:productId",ordersController.adminOrderStatusChangeForEachProduct);
router.get("/orderdetails/:id/:userId",ordersController.adminOrderDetailsGet);
router.get("/coupons",couponController.getCouponPage)
router.post("/addCoupon",couponController.addCoupon);
router.delete("/couponDelete", couponController.couponDelete);
router.get("/editCoupon",couponController.getEditCoupon);
router.post("/editCoupon",couponController.editCoupon);

router.get("/salesReport",salesController.getSalesReportPage)
router.get("/salesMonthly",salesController.salesMonthly)
router.get("/salesToday",salesController.salesToday)
router.get("/salesWeekly",salesController.salesWeekly)
router.get("/salesYearly",salesController.salesYearly)
router.get("/dateWiseFilter",salesController.dateWiseFilter)

router.get("/productOffers",offerController.productOfferPageGet);
router.post("/productAddOffer",offerController.productAddOffer);
router.get("/productEditOffer/:id",offerController.productOfferEditGet);
router.post("/productEditOffer",offerController.productOfferEdit);
router.delete("/deleteOffer",offerController.deleteOffer);

router.get("/categoryOffers", offerController.getCategoryOffer);
router.post("/categoryAddOffer",offerController.addCategoryOffer);
router.get("/catrgoryEditOffer/:id",offerController.categoryOfferEditGet);
router.post("/categoryEditOffer", offerController.categoryOfferEdit);










module.exports = router;