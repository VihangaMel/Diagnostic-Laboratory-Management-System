const mongoose = require("mongoose");

const staffSchema = mongoose.Schema(
  {
    nic: {
      type: String,
      required: true["NIC is required"],
      unique: true,
    },
    email: {
      type: String,
      required: true["Email is required"],
      unique: true,
    },
    number: {
      type: Number,
      required: true["Phone number is required"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      defalut: null,
    },
    gender: {
      type: String,
    },
    age: {
      type: Number,
      defult: null,
    },
    address: {
      type: String,
      default: null,
    },
    resetPsswordCode: String,
    resetPsswordCodeExpireAt: Date,
  },
  {
    timestamps: true,
  }
);

const staffModel = mongoose.model("Staff", staffSchema);

module.exports = staffModel;
