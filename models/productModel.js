const mongoose=require("mongoose");
const productSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"brand",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: String,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  productImage: {
    type: Array,
    required: true,
  },
  size: {
    s: {
      quantity: {
        type: Number,
        required: true,
      },
    },
    m: {
      quantity: {
        type: Number,
        required: true,
      },
    },
    l: {
      quantity: {
        type: Number,
        require: true,
      },
    },
  },
  color: {
    type: String,
    required: true,
  },
});
const Product=mongoose.model("products",productSchema);
module.exports=Product;