const nodemailer = require("nodemailer");

const generateOtp = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      const digits = "1234567890";
      var otp = "";
      for (i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
      }
      const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
          user: process.env.EMAIL_SERVICE_ID, 
          pass: process.env.EMAIL_SERVICE_PASS, 
        },
      });
      const mailOptions = {
        from: "gokulawesome365@gmail.com",
        to: userEmail,
        subject: "Your Otp Verfication code",
        text: `Your Otp is ${otp} `,
      };
      await transporter.sendMail(mailOptions);

      resolve(otp);
    } catch (error) {
      console.log(error);
    }
  });
};
module.exports = {
  generateOtp,
};
