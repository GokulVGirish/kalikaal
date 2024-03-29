const couponModale=require("../models/couponModel")
const cartModel=require("../models/cartModel")
const getAllCoupons=()=>{
    return new Promise(async(resolve,reject)=>{
        const coupons=await couponModale.find({})
        resolve(coupons)

    })
}
const addCoupon=(data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const couponName=data.couponName.trim()
            const exist=await couponModale.findOne({name:couponName})
           
          if(!exist){
                const values = {
                  name: couponName,
                  createdOn: new Date(data.startDate + "T00:00:00"),
                  expireOn: new Date(data.endDate + "T00:00:00"),
                  discount: parseInt(data.offerPrice),
                };
                const coupon = await couponModale.create(values);
                resolve({success:true,couponId:coupon._id});

          }else{

            resolve({ success: false});
          }
        }
        catch(error){
            console.log(error)
        }


    })
}

const editCoupon=(id,data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const couponName=data.couponName.trim()
            const coupon=await couponModale.findOne({_id:id})
            const existing=await couponModale.findOne({name:couponName})
            if(existing && existing._id.toString()!==id.toString()) {
                resolve({success:false,message:"coupon with same name already exist"})
            }
            else{
                
                 coupon.name = couponName;
                 coupon.createdOn = new Date(data.startDate + "T00:00:00");
                 coupon.expireOn = new Date(data.endDate + "T00:00:00");
                 coupon.discount = parseInt(data.offerPrice);
                 await coupon.save()
                 resolve({success:true,message:"coupon edited"})

            }


        }
        catch(error){
            console.log(error)
        }
    })
}
const applyCoupon=(userId,couponCode)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const coupon=await couponModale.findOne({couponCode:couponCode})
            if(coupon && coupon.isListed===true){
                if(!coupon.usedBy.includes(userId)){
                    const cart=await cartModel.findOne({userId:userId})
                      let discountedAmount = Math.round(
                        (cart.totalAmount * coupon.discount) / 100
                      );
                      cart.totalAmount -= discountedAmount;
                      cart.discountedAmount=discountedAmount

                     cart.coupon=couponCode
                     await cart.save()

                     coupon.usedBy.push(userId)
                     await coupon.save()
                     resolve({
                       success: true,
                       message: "Coupon Applied sucessfully",
                       couponName:coupon.name,
                       couponDiscount:coupon.discount,
                       totalAmount:cart.totalAmount,
                       couponId:coupon._id
                     });

                }
                else{
                    resolve({
                      success: false,
                      message: "Coupon already used",
                    });

                }

            }
            else{
                resolve({success:false,message:"Invalid coupon entered"})
            }


        }
        catch(error){
            console.log(error)
        }
    })
}
const clearCoupon=(userId)=>{
    return new Promise(async(resolve,reject)=>{
        const cart=await cartModel.findOne({userId:userId})
        if(cart.coupon!=null){
            const couponCode=cart.coupon
            const remove=await couponModale.updateOne({couponCode:couponCode},{$pull:{usedBy:userId}})
            const result=await cartModel.updateOne({userId:userId},{$unset:{coupon:null}})
            resolve({ status: true });


        }
        else{
            resolve({success:false})
        }
        

    })
}
module.exports={
    addCoupon,
    getAllCoupons,
    editCoupon,
    applyCoupon,
    clearCoupon
}