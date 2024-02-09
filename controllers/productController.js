const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");
const getAllProduct = async (req, res) => {
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
    ]);
    const message = req.flash("message");
   
    res.render("products", { data: products, message: message });
  } catch (error) {
    console.log(error.message);
  }
};
const getProductAddPage = async (req, res) => {
  try {
    const category = await categoryModel.find({ isListed: true });
    const brand = await brandModel.find({ isBlocked: false });

    res.render("product-add", { cat: category, brand: brand });
  } catch (error) {
    console.log(error.message);
  }
};
const addProduct = async (req, res) => {
  try {
    console.log("working");
    const products = req.body;
    console.log(products);
    const productExist = await productModel.findOne({
      productName: products.productName,
    });
    if (!productExist) {
      const images = [];
      console.log(req.files);
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
        salePrice: products.salePrice,
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
      console.log("failed");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const blockProduct = async (req, res) => {
  try {
    let id = req.query.id;
    await productModel.updateOne({ _id: id }, { $set: { isBlocked: true } });
    res.json({ message: "unlisted" });
  } catch (error) {
    console.log(error.message);
  }
};
const unblockProduct = async (req, res) => {
  try {
    let id = req.query.id;
    await productModel.updateOne({ _id: id }, { $set: { isBlocked: false } });
    res.json({ message: "listed" });
  } catch (error) {
    console.log(error.message);
  }
};
const getEditProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const findProduct = await productModel.findOne({ _id: id });
    const category = await categoryModel.find();
    const brand = await brandModel.find();
    console.log(findProduct);
    res.render("product-edit", {
      product: findProduct,
      cat: category,
      brand: brand,
    });
  } catch (error) {
    console.log(error.message);
  }
};
const editProduct = async (req, res) => {
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
      await productModel.findByIdAndUpdate(id,{productImage:images})
    }

    if (!duplicate || duplicate._id.toString() === id) {
      // Allow updating if it's the same product or the name doesn't exist
      console.log("Yes, product name available or it's the same product.");

      // Update product data
      await productModel.findByIdAndUpdate(
        id,
        {
          id: Date.now(),
          productName: data.productName,
          description: data.description,
          brand: data.brand,
          category: data.category,
          regularPrice: data.regularPrice,
          salePrice: data.salePrice,
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

      console.log("Product updated");
      req.flash("message", "Product sucessfully updated");
      res.redirect("/admin/products");
    } else {
      // Redirect if duplicate product name found
      req.flash("message", "A product with the same name already exists.");
      res.redirect("/admin/products");
      console.log("Product not updated due to duplicate name.");
    }
    

  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllProduct,
  getProductAddPage,
  addProduct,
  blockProduct,
  unblockProduct,
  getEditProduct,
  editProduct,
};
