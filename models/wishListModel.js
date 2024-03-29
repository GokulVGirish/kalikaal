const mongoose=require("mongoose")

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        
      },
    ],
  },
  {
    timestamps: true,
  }
);
const wishlist=mongoose.model("wishlist",wishlistSchema)
module.exports=wishlist