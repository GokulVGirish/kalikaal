const mongoose=require("mongoose")
const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  balance:{
    type:Number,
    default:0
  },
  walletData:[
    {
        amount:{
            type:Number
        },
        date:{
            type:Date
        },
        paymentMethod:{
            type:String
        }
    }
  ]
});
const wallet=mongoose.model("wallet",walletSchema)
module.exports=wallet