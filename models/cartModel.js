const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
      size: { type: String, required: true },
    },
  ],
  createdOn: { type: Date, default: Date.now },
  totalAmount: {
    type: Number,
  },
  coupon: {
    type: String,
    default: null,
  },
  discountedAmount:{
    type:Number
  }
});
const cart=mongoose.model("cart",cartSchema)
module.exports=cart
