const nodemailer = require("nodemailer");

const resetPasswordEmail = async (email, resetPasswordCode) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Changed to false for TLS
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: { name: "Admin", address: process.env.USER },
      to: email,
      subject: "Reset Your Password",
      html: `${resetPasswordCode}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

module.exports = resetPasswordEmail;
