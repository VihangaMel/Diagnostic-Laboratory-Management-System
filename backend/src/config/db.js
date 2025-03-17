const mongoose = require("mongoose");

const connectDB = (res, req) => {
  try {
    mongoose.connect(process.env.DB_URL);
    console.log("Mongodb connected successfully");
  } catch (error) {
    console.log("Mongob server issue" . error.message);
  }
};

module.exports = connectDB;
