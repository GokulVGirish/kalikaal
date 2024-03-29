const orderModel=require("../models/orderModel")
const couponModel=require("../models/couponModel")
const moment = require("moment");

const getSalesReportPage=(req,res,next)=>{

    try{
        let filterBy=req.query.day
        if(filterBy){
            res.redirect(`/admin/${req.query.day}`)
            
        }
        else{
            res.redirect(`/admin/salesMonthly`)
        }

    }
    catch(error){
       next(error)
    }
}
const salesMonthly=async(req,res,next)=>{
    try{
      let currentMonth = new Date().getMonth() + 1;
      const startOfTheMonth = new Date(
        new Date().getFullYear(),
        currentMonth - 1,
        1,
        0,
        0,
        0,
        0
      );
      const endOfTheMonth = new Date(
        new Date().getFullYear(),
        currentMonth,
        0,
        23,
        59,
        59,
        999
      );
      const orders = await orderModel.aggregate([
        {
          $match: {
            orderedOn: {
              $gte: startOfTheMonth,
              $lt: endOfTheMonth,
            },
          },
        },
        {
          $sort: { createdOn: -1 },
        },
        {
          $lookup: {
            from: "users",
            localField:"user",
            foreignField:"_id",
            as:"theUser"
          },


        },
        {$unwind:"$theUser"},
        
        {
          $unwind: "$products", 
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product", 
            foreignField: "_id", 
            as: "populatedProduct", 
          },
        },
        {
          $unwind: "$populatedProduct",
        },
      ]);
     

    
      
      const filtered = orders.filter((order) => {
       
    
        return order.products.status === "delivered";
      });
      for (const order of filtered) {
        if (order.coupon) {
          const couponValue = order.coupon;
          const couponDocument = await couponModel.findOne({
            couponCode: couponValue,
          });

          if (couponDocument) {
            const couponDiscount = couponDocument.discount;
            order.couponDiscount = couponDiscount;
          } else {
            order.couponDiscount = "no coupon";
          }
        }
      }

     const totalPrice = filtered.reduce(
        
      (total, order) => total + order.products.productPrice,
      0
    );

      

  

      let itemsPerPage = 5;
      let currentPage = parseInt(req.query.page) || 1;
      let startIndex = (currentPage - 1) * itemsPerPage;
      let endIndex = startIndex + itemsPerPage;
      let totalPages = Math.ceil(filtered.length / 3);
      const currentOrder = filtered.slice(startIndex, endIndex);
  

      res.render("salesReport", {
        data: currentOrder,
        totalPages,
        currentPage,
        salesMonthly: true,
        totalPrice,
        count:filtered.length
      });
    }
    catch(error){
      next(error)
    }
}
const salesToday=async(req,res,next)=>{
    try{
        let today = new Date();
        const startOfTheDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
          0
        );

        const endOfTheDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          999
        );
        const orders = await orderModel.aggregate([
          {
            $match: {
              orderedOn: {
                $gte: startOfTheDay,
                $lt: endOfTheDay,
              },
            },
          },
          {
            $sort: { createdOn: -1 },
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "theUser",
            },
          },
          { $unwind: "$theUser" },

          {
            $unwind: "$products", 
          },
          {
            $lookup: {
              from: "products", 
              localField: "products.product", 
              foreignField: "_id", 
              as: "populatedProduct", 
            },
          },
          {
            $unwind: "$populatedProduct",
          },
        ]);
      const filtered = orders.filter((order) => {
       
        return order.products.status === "delivered";
      });
      for (const order of filtered) {
        if (order.coupon) {
          const couponValue = order.coupon;
          const couponDocument = await couponModel.findOne({
            couponCode: couponValue,
          });

          if (couponDocument) {
            const couponDiscount = couponDocument.discount;
            order.couponDiscount = couponDiscount;
          } else {
            order.couponDiscount = "no coupon";
          }
        }
      }
      const totalPrice = filtered.reduce(
        (total, order) => total + order.products.productPrice,
        0
      );

      let itemsPerPage = 5;
      let currentPage = parseInt(req.query.page) || 1;
      let startIndex = (currentPage - 1) * itemsPerPage;
      let endIndex = startIndex + itemsPerPage;
      let totalPages = Math.ceil(filtered.length / 3);
      const currentOrder = filtered.slice(startIndex, endIndex);
    

      res.render("salesReport", {
        data: currentOrder,
        totalPages,
        currentPage,
        salesToday: true,
        totalPrice,
        count:filtered.length
      });

        
    }
    catch(error){
       next(error)
    }
}
const salesWeekly=async(req,res,next)=>{
    try{
        let currentDate = new Date();
        const startOfTheWeek = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - currentDate.getDay()
        );

        const endOfTheWeek = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + (6 - currentDate.getDay()),
          23,
          59,
          59,
          999
        );
        const orders = await orderModel.aggregate([
          {
            $match: {
              orderedOn: {
                $gte: startOfTheWeek,
                $lt: endOfTheWeek,
              },
            },
          },
          {
            $sort: { createdOn: -1 },
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "theUser",
            },
          },
          { $unwind: "$theUser" },

          {
            $unwind: "$products", 
          },
          {
            $lookup: {
              from: "products", 
              localField: "products.product", 
              foreignField: "_id", 
              as: "populatedProduct", 
            },
          },
          {
            $unwind: "$populatedProduct",
          },
        ]);
      const filtered = orders.filter((order) => {
     
        return order.products.status === "delivered";
      });
      for (const order of filtered) {
        if (order.coupon) {
          const couponValue = order.coupon;
          const couponDocument = await couponModel.findOne({
            couponCode: couponValue,
          });

          if (couponDocument) {
            const couponDiscount = couponDocument.discount;
            order.couponDiscount = couponDiscount;
          } else {
            order.couponDiscount = "no coupon";
          }
        }
      }
      const totalPrice = filtered.reduce(
        (total, order) => total + order.products.productPrice,
        0
      );

      let itemsPerPage = 5;
      let currentPage = parseInt(req.query.page) || 1;
      let startIndex = (currentPage - 1) * itemsPerPage;
      let endIndex = startIndex + itemsPerPage;
      let totalPages = Math.ceil(filtered.length / 3);
      const currentOrder = filtered.slice(startIndex, endIndex);
     

      res.render("salesReport", {
        data: currentOrder,
        totalPages,
        currentPage,
        salesWeekly: true,
        totalPrice,
        count:filtered.length
      });



    }
    catch(error){
      next(error)
    }
}
const salesYearly=async(req,res,next)=>{
    try{
         const currentYear = new Date().getFullYear();
         const startofYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
         const endofYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
         const orders = await orderModel.aggregate([
           {
             $match: {
               orderedOn: {
                 $gte: startofYear,
                 $lt: endofYear,
               },
             },
           },
           {
             $sort: { createdOn: -1 },
           },
           {
             $lookup: {
               from: "users",
               localField: "user",
               foreignField: "_id",
               as: "theUser",
             },
           },
           { $unwind: "$theUser" },

           {
             $unwind: "$products",
           },
           {
             $lookup: {
               from: "products",
               localField: "products.product", 
               foreignField: "_id", 
               as: "populatedProduct", 
             },
           },
           {
             $unwind: "$populatedProduct",
           },
         ]);
         const filtered = orders.filter((order) => {
           
           return order.products.status === "delivered";
         });
         for (const order of filtered) {
           if (order.coupon) {
             const couponValue = order.coupon;
             const couponDocument = await couponModel.findOne({
               couponCode: couponValue,
             });

             if (couponDocument) {
               const couponDiscount = couponDocument.discount;
               order.couponDiscount = couponDiscount;
             } else {
               order.couponDiscount = "no coupon";
             }
           }
         }
         const totalPrice = filtered.reduce(
           (total, order) => total + order.products.productPrice,
           0
         );

         let itemsPerPage = 5;
         let currentPage = parseInt(req.query.page) || 1;
         let startIndex = (currentPage - 1) * itemsPerPage;
         let endIndex = startIndex + itemsPerPage;
         let totalPages = Math.ceil(filtered.length / 3);
         const currentOrder = filtered.slice(startIndex, endIndex);
     

         res.render("salesReport", {
           data: currentOrder,
           totalPages,
           currentPage,
           salesYearly: true,
           totalPrice,
           count: filtered.length,
         });





    }
    catch(error){
       next(error)
    }

}
const dateWiseFilter=async(req,res,next)=>{
    try{
    
        const date = moment(req.query.date).startOf("day").toDate();
        const orders = await orderModel.aggregate([
          {
            $match: {
              orderedOn: {
                $gte: moment(date).startOf("day").toDate(),
                $lt: moment(date).endOf("day").toDate(),
              },
            },
          },
          {
            $sort: { createdOn: -1 },
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "theUser",
            },
          },
          { $unwind: "$theUser" },

          {
            $unwind: "$products",
          },
          {
            $lookup: {
              from: "products", 
              localField: "products.product", 
              foreignField: "_id", 
              as: "populatedProduct", 
            },
          },
          {
            $unwind: "$populatedProduct",
          },
        ]);
        const filtered = orders.filter((order) => {
        
          return order.products.status === "delivered";
        });
        for (const order of filtered) {
          if (order.coupon) {
            const couponValue = order.coupon;
            const couponDocument = await couponModel.findOne({
              couponCode: couponValue,
            });

            if (couponDocument) {
              const couponDiscount = couponDocument.discount;
              order.couponDiscount = couponDiscount;
            } else {
              order.couponDiscount = "no coupon";
            }
          }
        }
        const totalPrice = filtered.reduce(
          (total, order) => total + order.products.productPrice,
          0
        );

        let itemsPerPage = 5;
        let currentPage = parseInt(req.query.page) || 1;
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let totalPages = Math.ceil(filtered.length / 3);
        const currentOrder = filtered.slice(startIndex, endIndex);
        

        res.render("salesReport", {
          data: currentOrder,
          totalPages,
          currentPage,
          salesMonthly: true ,
           date,
          totalPrice,
          count: filtered.length,
        });





    }
    catch(error){
       next(error)
    }

}

module.exports={
    getSalesReportPage,
    salesMonthly,
    salesToday,
    salesWeekly,
    salesYearly,
    dateWiseFilter,
}