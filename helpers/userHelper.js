const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const walletModel=require("../models/walletModel")
const Razorpay=require("razorpay")
var instance = new Razorpay({
  key_id: "rzp_test_ju6rorodT9IZ3H",
  key_secret: "O3wYE8sZfw1DSf3wOC4nSpmQ",
});

const doLogin = (userData) => {
  return new Promise(async (resolve, reject) => {
      try{
    let user = await userModel.findOne({ email: userData.email });
    let response = {};
    if (user) {
      if (user.isActive) {
        bcrypt.compare(userData.password, user.password).then((result) => {
          if (result) {
            response.user = user;
            response.loggedIn = true;
            resolve(response);
          } else {
            response.logginMessage = "Invalid username or password";
            resolve(response);
          }
        });
      } else {
        response.logginMessage = "Blocked user";
        resolve(response);
      }
    } else {
      response.logginMessage = "Invalid username or password";
      resolve(response);
    }}
    catch(error){
      console.log(error)
    }
  });
};
const doSignup = (userData, verify,eMail) => {
  return new Promise(async (resolve, reject) => {
    const response = {};
   
    const isUserExist = await userModel.findOne({
      $or: [{ email: userData.email }, { phone: userData.phone }],
    });
    if(userData.email===eMail){
      if (!isUserExist) {
       
        if (userData.password === userData.confpassword) {
          console.log("password matched");
          if (verify) {
          
            userData.password = await bcrypt.hash(userData.password, 10);
            const user =await userModel
              .create({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
              })
              
                response.status = true;
                response.message = "Signed Up Successfully";
                response.user=user
                resolve(response);
             
          } else {
            response.status = false;
            response.message = "OTP doesnt match";
            resolve(response);
          }
        } else {
          response.status = false;
          response.message = "Password Doesnt Match";
          resolve(response);
        }
      } else {
        response.message = "User Already Exist";
        response.status = false;
        resolve(response);
      }
      
    }else{
      response.status = false;
      response.message = "Entered email is invalid";
      resolve(response);

    }
    
  });
};
const emailModify = async (newEmail, sessionemail, password, verified,userId) => {
  return new Promise(async(resolve,reject)=>{
    try {
    const response = {};
   
    const user = await userModel.findById(userId);
   

    if (newEmail === sessionemail) {
      if (verified) {
        const passwordMatch = await bcrypt.compare(password, user.password); // Await for password comparison
        if (passwordMatch) {
          user.email = newEmail;
          await user.save();
          response.status = true;
          response.updateMessage = "email changed";
           resolve(response);
        } else {
          response.status = false;
          response.updateMessage = "Invalid password";
           resolve(response);
        }
      } else {
        response.status = false;
        response.updateMessage = "otp verification failed";
        resolve(response)
      }
    } else {
      response.status = false;
      response.updateMessage = "Entered email is invalid";
       resolve(response);
    }

    
  } catch (error) {
    console.error(error);
    throw error;
  }
  })
};
const generateRazorpay = (userId, totalAmount) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("orderid at generate razorpay",orderId)
      // console.log("totalAmount ",totalAmount)
      instance.orders.create(
        {
          amount: totalAmount*100,
          currency: "INR",
          receipt: userId,
          notes: {
            key1: "value3",
            key2: "value2",
          },
        },
        function (err, order) {
          if (err) {
            console.error(err);
            return;
          } else {
            const response = {
              success: true,
              order: order,
            };
            //console.log("order in generateRazorpay",order)
            resolve(response);
          }
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  });
};
const refferalOfferApply=(userId,refferalCode)=>{
  return new Promise(async(resolve,reject)=>{
    try{
        const updatedWalletNewUser = await walletModel.updateOne(
              { user: userId },
              {
                $push: {
                  walletData: {
                    date: new Date(),
                    paymentMethod: "refferal",
                    amount: 100,
                  },
                },
                $inc: { balance: 100 },
              },
              { upsert: true }
            );
            const refferedUser=await userModel.findOne({referralCode:refferalCode})
        
           if(refferedUser){
             const updatedWalletReffered = await walletModel.updateOne(
               { user: refferedUser._id },
               {
                 $push: {
                   walletData: {
                     date: new Date(),
                     paymentMethod: "refferal",
                     amount: 100,
                   },
                 },
                 $inc: { balance: 100 },
               },
               { upsert: true }
             );
           }
            resolve(updatedWalletNewUser)

    }
    catch(error){
      console.log(error)
    }
  })
}




module.exports = {
  doLogin,
  doSignup,
  emailModify,
  generateRazorpay,
  refferalOfferApply
};
