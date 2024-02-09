const userModel=require("../models/userModel")
const customerList=async(req,res)=>{
    try{
        const dataList=await userModel.find()
       if(dataList){
         res.render("customerList",{data:dataList})
       }
       else{
        console.log("didnt receive user data")
       }

    }
    catch(error){
        console.log(error)
    }
}
const customerBlock=async(req,res)=>{
    try{
        let id=req.query.id
        await userModel.updateOne({_id:id},{$set:{isActive:false}})
        delete req.session.user
         res.json({ message: "blocked" });


    }
    catch(error){
        console.log(error.message)

    }

}
const customerUnblock=async(req,res)=>{
     try{
        let id=req.query.id
        await userModel.updateOne({_id:id},{$set:{isActive:true}})
           res.json({ message: "unblocked" });


    }
    catch(error){
        console.log(error.message)

    }
    

}
module.exports={
    customerList,
    customerBlock,customerUnblock
}