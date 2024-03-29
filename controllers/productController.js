const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");
const cartModel=require("../models/cartModel")
const reviewModel=require("../models/reviewModel")
const offerHelper=require("../helpers/offerHelper")
const fs=require("fs")
const path=require("path")
const getAllProduct = async (req, res,next) => {
  try {
    const products = await productModel.aggregate([
      {
        $lookup: {
          from: "categories", 
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind:"$category"
      }
    ]);
    const items=await offerHelper.findOffer(products)

    const message = req.flash("message");
   
    res.render("products", { data: items, message: message });
  } catch (error) {
  next(error)
  }
};
const getProductAddPage = async (req, res,next) => {
  try {
    const category = await categoryModel.find({ isListed: true });
    const brand = await brandModel.find({ isBlocked: false });

    res.render("product-add", { cat: category, brand: brand });
  } catch (error) {
  next(error)
  }
};
const addProduct = async (req, res,next) => {
  try {
  
    const products = req.body;

    const productExist = await productModel.findOne({
      productName: products.productName,
    });
    if (!productExist) {
      const images = [];
 
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          images.push(req.files[i].filename);
        }
      }
      await productModel.create({
        id: Date.now(),
        productName: products.productName,
        description: products.description,
        brand: products.brand,
        category: products.category,
        regularPrice: products.regularPrice,
        discount: products.salePrice,
        createdOn: new Date(),
        totalQuantity: products.quantity,
        size: {
          s: {
            quantity: products.ssize,
          },
          m: {
            quantity: products.msize,
          },
          l: {
            quantity: products.lsize,
          },
        },
        color: products.color,
        productImage: images,
      });
      res.redirect("/admin/products");
    } else {
      req.flash("message", "product already exist");
      res.redirect("/admin/products");
     
    }
  } catch (error) {
   next(error)
  }
};
const blockProduct = async (req, res,next) => {
  try {
    let id = req.query.id;
    await productModel.updateOne({ _id: id }, { $set: { isBlocked: true } });
    res.json({ message: "unlisted" });
  } catch (error) {
   next(error)
  }
};
const unblockProduct = async (req, res,next) => {
  try {
    let id = req.query.id;
    await productModel.updateOne({ _id: id }, { $set: { isBlocked: false } });
    res.json({ message: "listed" });
  } catch (error) {
    next(error)
  }
};
const getEditProduct = async (req, res,next) => {
  try {
    const id = req.query.id;
    const findProduct = await productModel.findOne({ _id: id });
    const category = await categoryModel.find();
    const brand = await brandModel.find();

    res.render("product-edit", {
      product: findProduct,
      cat: category,
      brand: brand,
    });
  } catch (error) {
    next(error)
  }
};
const editProduct = async (req, res,next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const images = [];

    // Extracting filenames from uploaded files
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        images.push(req.files[i].filename);
      }
    }
    // Check for duplicate product name
    const duplicate = await productModel.findOne({
      productName: data.productName,
    });

    if (req.files.length > 0) {
      const product=await productModel.findOne({_id:id})
      const photos=product.productImage
     
      for(let i=0;i<photos.length;i++){
        const publicFolderPath = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          "product-images"
        );
        const imagePath = path.join(publicFolderPath,photos[i]);
        fs.unlinkSync(imagePath); 

      }
     await productModel.findByIdAndUpdate(id, {
       $set: { productImage: images },
     });
    }

    if (!duplicate || duplicate._id.toString() === id) {
     
     

     
      await productModel.findByIdAndUpdate(
        id,
        {
          id: Date.now(),
          productName: data.productName,
          description: data.description,
          brand: data.brand,
          category: data.category,
          regularPrice: data.regularPrice,
          discount: data.salePrice,
          totalQuantity: data.quantity,
          size: {
            s: {
              quantity: data.ssize,
            },
            m: {
              quantity: data.msize,
            },
            l: {
              quantity: data.lsize,
            },
          },
          color: data.color,
          createdOn: new Date()
        },
        { new: true }
      );

     
      req.flash("message", "Product sucessfully updated");
      res.redirect("/admin/products");
    } else {
      // Redirect if duplicate product name found
      req.flash("message", "A product with the same name already exists.");
      res.redirect("/admin/products");
     
    }
    

  } catch (error) {
   next(error)
  }
};
const deleteImage= async (req,res,next)=>{
  try{
    const { productId, filename } = req.body;
    const result = await productModel.findByIdAndUpdate(
      { _id: productId },
      { $pull: { productImage: filename } }
    );
   
    const publicFolderPath = path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      "product-images"
    ); // Adjust the path based on the actual folder structure

    // Construct the full path to the image file based on the public folder path and the filename
    const imagePath = path.join(publicFolderPath, filename);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting the image:", err);
      } else {
        console.log("Image deleted successfully");
      }
    });
    if (result) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  }
  catch(error){
 next(error)
  }
}

module.exports = {
  getAllProduct,
  getProductAddPage,
  addProduct,
  blockProduct,
  unblockProduct,
  getEditProduct,
  editProduct,
  deleteImage
};
