const categoryModel=require("../models/categoryModel")

const getCategory= async(req,res,next)=>{
    try{
        const category= await categoryModel.find()
        const message=req.flash("message")
        res.render("category",{cat:category,message:message})

    }
    catch(error){
     next(error)

    }

}
const blockCategory=async(req,res,next)=>{
    try{
        let id=req.query.id
        await categoryModel.updateOne({_id:id},{$set:{isListed:false}})
        res.json({message:"unlisted"})
        


    }
    catch(error){
       next(error)
    }
}
const unblockCategory=async(req,res,next)=>{
    try{
        
         let id=req.query.id
        await categoryModel.updateOne({_id:id},{$set:{isListed:true}})
        res.json({ message: "listed" });
        



    }
    catch(error){
        next(error)
    }
}
const addCategoryGet=(req,res,next)=>{
    try{
        res.render("category-add")

    }
    catch(error){
        next(error)
       

    }
}
const addCategory=async(req,res,next)=>{
    try{
        console.log(req.body)
          const {name,description}=req.body
          const lowerCaseName = name.toLowerCase();
         
          const categoryExist=await categoryModel.findOne({name:lowerCaseName})
          if(description){
            if(!categoryExist){
                await categoryModel.create({
                    name:name,
                    description:description
                })
                 req.flash("message", "Category Created")
                 res.redirect("/admin/category")
              

            }
            else{
                req.flash("message", "Category already Exist");
                 res.redirect("/admin/category")
         
            }
           
          }
          else{
            req.flash("message", "Description required");
            res.redirect("/admin/category")
            

          }
    }
    catch(error){
       next(error)
    }

}

const editCategoryGet=async(req,res,next)=>{
    try{
        const id=req.query.id
         const category=await categoryModel.findOne({_id:id})
        res.render("category-edit",{cat:category})

    }
    catch(error){
       next(error)

    }
}
const editCategory=async(req,res,next)=>{
    try{
        const id=req.params.id
         const data=req.body
         const lowerCaseName = data.name.toLowerCase();
        const duplicateCat=await categoryModel.findOne({name:lowerCaseName})
        if(!duplicateCat||duplicateCat._id.toString()===id){
            
            await categoryModel.findByIdAndUpdate(id,{
                name:data.name,
                description:data.description
            })
             req.flash("message", "Category updated");
             res.redirect("/admin/category");

        }
      else{
        req.flash("message","Category with same name already exist")
          res.redirect("/admin/category");

      }

    }
    catch(errror){
       next(errror)
    }
}

module.exports={
    getCategory,
    blockCategory,
    unblockCategory,
    addCategoryGet,
    addCategory,
    editCategoryGet,
    editCategory
}

