const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  offerName: {
    type: String,
    required: true,
  },
  startingDate: {
    type: Date,
    required: true,
  },
  endingDate: {
    type: Date,
    required: true,
  },
  productOffer: {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    discount: { type: Number },
    offerStatus: {
      type: Boolean,
      default: false,
    },
  },
  categoryOffer: {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    discount: { type: Number },
    offerStatus: {
      type: Boolean,
      default: false,
    },
  },
  status: {
    type: Boolean,
    default: true,
  },
});

offerSchema.pre("save", function (next) {
  const currentDate = new Date();
  if (currentDate > this.endingDate) {
    this.status = false;
  }
  next();
});
const offerModel = mongoose.model("offer", offerSchema);

module.exports = offerModel;