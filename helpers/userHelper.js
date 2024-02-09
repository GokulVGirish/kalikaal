const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

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
    console.log("helper");
    const isUserExist = await userModel.findOne({
      $or: [{ email: userData.email }, { phone: userData.phone }],
    });
    if(userData.email===eMail){
      if (!isUserExist) {
        console.log("user exist");
        console.log(userData);
        if (userData.password === userData.confpassword) {
          console.log("password matched");
          if (verify) {
            console.log("verified");
            userData.password = await bcrypt.hash(userData.password, 10);
            userModel
              .create({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
              })
              .then((data) => {
                response.status = true;
                response.message = "Signed Up Successfully";
                resolve(response);
                console.log(data);
              })
              .catch((error) => {
                reject(error);
              });
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

module.exports = {
  doLogin,
  doSignup,
};
