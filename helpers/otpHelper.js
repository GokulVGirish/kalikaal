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
        service: "gmail", // Replace with your email service
        auth: {
          user: process.env.email, // Replace with your email address
          pass: process.env.passkey, // Replace with your email password
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
