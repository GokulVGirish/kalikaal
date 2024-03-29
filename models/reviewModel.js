const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: { type: Number, required: true },
  reviewText: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const review = mongoose.model("review", reviewSchema);
module.exports=review