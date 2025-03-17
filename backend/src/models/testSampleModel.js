const mongoose = require("mongoose");
const Patient = require("./patientModel");
const Test = require("./testModel");

const testSampleSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientName: {
      type: String,
      ref: "Patient",
    },
    patientNIC: {
      type: String,
      required: true,
    },
    patientNumber: {
      type: Number,
    },
    patientEmail: {
      type: String,
      required: true,
    },
    testName: {
      type: [String],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    sampleStatus: {
      type: String,
      required: true,
      default: "To Get Sample",
    },
    date: {
      type: Date,
      default: () => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC
        return today.toISOString(); // Convert to ISO format (YYYY-MM-DDT00:00:00.000Z)
      },
    },
  },
  { timestamps: true }
);

const testSampleModel = mongoose.model("TestSample", testSampleSchema);

module.exports = testSampleModel;
