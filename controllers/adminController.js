const adminModel=require("../models/adminModel")
const categoryModel=require("../models/categoryModel")
const orderModel=require("../models/orderModel")
const dateHelper=require("../helpers/dateHelper")

const loginload = (req, res,next) => {
    try{
        if (req.session.admin) {
          res.redirect("/admin/admindash");
        } else {
          const message = req.flash("message");
          res.render("adminLogin", { message: message });
        }

    }
    catch(error){
        next(error)
    }

};
const logAdmin=async(req,res,next)=>{
    try{
        const admin = await adminModel.findOne({ email: req.body.email });
        
        if (admin) {
         
          if (admin.password === req.body.password) {
            req.session.admin = admin;

            res.redirect("/admin/admindash");
          } else {
            
            req.flash("message", "Invalid username or password");
            res.redirect("/admin");
          }
        } else {
          req.flash("message", "Invalid username or password");
          res.redirect("/admin");
        }
   

    }
    catch(error){
       next(error)
    }

}
const adminDash=async(req,res,next)=>{
   try{
     if (req.session.admin) {
      const category=await orderModel.aggregate([
        {$unwind:"$products"},
        {$lookup:{
          from:"products",
          localField:"products.product",
          foreignField:"_id",
          as:"prod"
        }},
        {$unwind:"$prod"},
        {$lookup:{
          from:"categories",
          localField:"prod.category",
          foreignField:"_id",
          as:"category"
        }},
        {$unwind:"$category"},
        {$group:{
          _id:"$category",
          count:{$sum:1}
        }}

      ])
      const orders= await orderModel.aggregate([
        {$unwind:"$products"},
        {$group:{
          _id:"$products.status",
          count:{$sum:1}
        }}
      ])
      const brand=await orderModel.aggregate([
        {$unwind:"$products"},
        {$lookup:{
          from:"products",
          localField:"products.product",
          foreignField:"_id",
          as:"prod"
        }},
        {$unwind:"$prod"},
        {$lookup:{
          from:"brands",
          localField:"prod.brand",
          foreignField:"_id",
          as:"brand"
        }},
        {$unwind:"$brand"},
        {$group:{
          _id:"$brand",
          count:{$sum:1}
        }}

      ])
    
      const salesReport = await orderModel.aggregate([
        { $unwind: "$products" },
        { $match: { "products.status": "delivered" } },
        {
          $group: {
            _id: { $month: "$orderedOn" },
            totalAmount: { $sum: "$products.productPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const bestSellingProduct = await orderModel.aggregate([
        { $unwind: "$products" },
        { $match: { "products.status": "delivered" } },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $group: {
            _id: "$product", 
            productName: { $first: "$product.productName" }, 
            totalCount: { $sum: "$products.quantity" },
          },
        },
        { $sort: { totalCount: -1 } },
        { $limit: 10 },
      ]);
      const yearlyReport = await orderModel.aggregate([
        { $unwind: "$products" },
        { $match: { "products.status": "delivered" } }, 
        {
          $group: {
            _id: { $year: "$orderedOn" },
            totalAmount: { $sum: "$products.productPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      let currentDate = new Date();
      let currentMonth = currentDate.getMonth(); // This will return the month (0-indexed)
      const currentYe = currentDate.getFullYear();
      const weeksWithDates = await dateHelper.getWeeksOfMonth(
        currentYe,
        currentMonth
      );
      
      const Dates = weeksWithDates.flat();
      let weeklyDatas = [];
      let DatNum = [];
      for (let i = 0; i < Dates.length; i++) {
        const startDate = Dates[i];
        const endDate = Dates[i + 1]; // Assuming Dates is an array of date strings
        DatNum.push(i + 1);

        const Datas = await orderModel.aggregate([
          { $unwind: "$products" },
          {
            $match: {
              "products.status": "delivered",
              orderedOn: { $gte: new Date(startDate), $lt: new Date(endDate) },
            },
          },
          {
            $group: {
              _id: "$orderId",
              totalAmount: { $sum: "$products.productPrice" },
              totalProducts: { $sum: 1 },
            },
          },
        ]);

        weeklyDatas.push(Datas);
      }

      weeklyDatas = weeklyDatas.flat();
      const weekly = {
        weeklyDatas,
        DatNum,
      };
    
  
   
 


   

      
      

       res.render("adminDash", {
         category: category,
         order: orders,
         brand: brand,
         salesReport: salesReport,
         bestSellingProduct,
         yearly:yearlyReport,
         weekly
         
       });
     } else {
       res.redirect("/admin");
     }


   }
   catch(error){
next(error)
   }
}
const adminLogout = (req, res,next) => {
  try {
    delete req.session.admin;
    res.redirect("/admin");
  } catch (error) {
  next(error)
  }
};

module.exports={
    loginload,
    logAdmin,
    adminDash,
    adminLogout
}