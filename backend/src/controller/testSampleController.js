const testSampleModel = require("../models/testSampleModel");
const patientModel = require("../models/patientModel");
const emailValidator = require("../validators/emailValidator");
const nicValidator = require("../validators/nicValidator");
const phoneNumberValidator = require("../validators/phoneNumberValidator");
const validateNIC = require("../validators/nicValidator");
const resetPasswordEmail = require("../modules/email/resetPassowrdEmail");

const addSample = async (req, res) => {
  try {
    const {
      patientName,
      patientNIC,
      patientNumber,
      patientEmail,
      testName,
      totalPrice,
      sampleStatus,
    } = req.body;

    let patient = await patientModel.findOne({
      nic: patientNIC,
    });

    if (!patient) {
      if (!emailValidator(patientEmail)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
      }
      if (!nicValidator(patientNIC)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid NIC number.",
        });
      }
      if (!phoneNumberValidator(patientNumber)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid phone number.",
        });
      }
      patient = new patientModel({
        name: patientName,
        nic: patientNIC,
        number: patientNumber,
        email: patientEmail,
      });
      await patient.save();
    }

    const testSample = new testSampleModel({
      patient: patient._id,
      patientName: patient.name,
      patientNIC: patient.nic,
      patientNumber: patient.number,
      patientEmail: patient.email,
      testName,
      totalPrice,
      sampleStatus,
    });

    await testSample.save();

    return res
      .status(200)
      .json({ success: true, message: "Sample added successfully." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const updateSample = async (req, res) => {
  try {
    const { patientNIC } = req.body;
    let { date } = req.body;
    const formattedDate = new Date(date);
    formattedDate.setUTCHours(0, 0, 0, 0);
    // console.log(formattedDate);

    let updatedTestSample = await testSampleModel
      .find({
        $or: [{ patientNIC: patientNIC }],
        date: formattedDate,
      })
      .sort({ createdAt: -1 })
      .limit(1);

    // console.log(updatedTestSample)

    if (updatedTestSample.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Test sample not found for the given date.",
      });
    }

    updatedTestSample = updatedTestSample[0];

    const updateData = {};

    for (const key in req.body) {
      if (req.body[key] && key !== "patientNIC") {
        updateData[key] = req.body[key];
      }
    }

    const updatedTestSampleDoc = await testSampleModel.findOneAndUpdate(
      { _id: updatedTestSample._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    const sampleStatus = updatedTestSampleDoc.sampleStatus;
    // console.log(sampleStatus);
    if (sampleStatus == "Analized") {
      const patientEmail = updatedTestSampleDoc.patientEmail;
      resetPasswordEmail(patientEmail);
    }

    return res.status(200).json({
      success: true,
      message: "Test Sample updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const getAllTestSamples = async (req, res) => {
  try {
    const testSamples = await testSampleModel.find();
    if (!testSamples) {
      return res
        .status(400)
        .json({ success: false, message: "There are no test samples." });
    }
    return res.status(200).send(testSamples);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const getTestSamplesByPatient = async (req, res) => {
  try {
    const { patientNIC } = req.body;
    if (!validateNIC(patientNIC)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid NIC format." });
    }
    if (!patientNIC) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter patient nic." });
    }
    const testSamples = await testSampleModel.find({ patientNIC });
    return res.status(200).send(testSamples);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

module.exports = {
  addSample,
  updateSample,
  getAllTestSamples,
  getTestSamplesByPatient,
};
