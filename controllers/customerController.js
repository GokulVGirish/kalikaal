const userModel=require("../models/userModel")

const customerList=async(req,res,next)=>{
    try{
        const dataList=await userModel.find()
       if(dataList){
         res.render("customerList",{data:dataList})
       }
       else{
       
       }

    }
    catch(error){
      next(error)
    }
}
const customerBlock=async(req,res,next)=>{
    try{
        let id=req.query.id
        await userModel.updateOne({_id:id},{$set:{isActive:false}})
        delete req.session.user
         res.json({ message: "blocked" });


    }
    catch(error){
     next(error)

    }

}
const customerUnblock=async(req,res,next)=>{
     try{
        let id=req.query.id
        await userModel.updateOne({_id:id},{$set:{isActive:true}})
           res.json({ message: "unblocked" });


    }
    catch(error){
    next(error)

    }
    

}
module.exports={
    customerList,
    customerBlock,customerUnblock
}