const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    nic: {
      type: String,
      required: true["NIC is required"],
      unique: true,
    },
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true["Email is required"],
      unique: true,
    },
    number: {
      type: Number,
      default: null,
      unique: true,
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
    },
    address: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.model("Patient", patientSchema);

module.exports = patientModel;
