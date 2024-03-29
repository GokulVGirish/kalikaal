
const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  couponCode: {
    type: String,
    uppercase: true,
    unique: true,
    default: generateCouponCode,
  },
  createdOn: {
    type: Date,
    required: true,
  },
  expireOn: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },

  isListed: {
    type: Boolean,
    default: true,
  },
  usedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  ],
});
function generateCouponCode() {
  const length = 8; // Length of the coupon code
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Characters to use for generating the code
  let couponCode = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    couponCode += characters.charAt(randomIndex);
  }
  return couponCode;
}

couponSchema.pre("save", function (next) {
  if (this.expireOn <= new Date()) {
    this.isListed=false
  }else{
    this.isListed = true

  }
  next();
});
const coupon = mongoose.model("coupon", couponSchema);

module.exports = coupon;