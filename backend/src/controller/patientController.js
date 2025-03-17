const validateEmail = require("../validators/emailValidator");
const validatePhoneNumber = require("../validators/phoneNumberValidator");
const validateNIC = require("../validators/nicValidator");
const patientModel = require("../models/patientModel");

const registerPatient = async (req, res) => {
  try {
    const { nic, name, email, number, age, gender, address } = req.body;
    // console.log(nic, name, email, number, age, gender, address);
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }
    if (!validatePhoneNumber(number)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number format." });
    }
    if (!validateNIC(nic)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid NIC format." });
    }
    try {
      const patient = new patientModel({
        nic: nic,
        name: name,
        email: email,
        number: number,
        age: age,
        gender: gender,
        address: address,
      });
      await patient.save();
      res
        .status(200)
        .send({ success: true, message: "Patient registered successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server error:" + error.message });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { nic, number, email } = req.body;
    const updateData = {};

    if (!emailValidator(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }
    if (!nicValidator(nic)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid NIC number.",
      });
    }
    if (!phoneNumberValidator(number)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    for (const key in req.body) {
      if (
        req.body[key] &&
        key !== "nic" &&
        key !== "number" &&
        key !== "email"
      ) {
        updateData[key] = req.body[key];
      }
    }

    if (!nic && !number && !email) {
      return res.status(400).json({
        success: false,
        message:
          "NIC/ Email or phone number is required to update patient data.",
      });
    }

    const updatedPatient = await patientModel.findOneAndUpdate(
      { $or: [{ nic }, { number }, { email }] },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: "Server error: " + error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { nic, number, email } = req.body;
    if (!nic && !number && !email) {
      return res.status(400).json({
        success: false,
        message:
          "NIC/ Email or phone number is required to delete patient data.",
      });
    }
    const patient = await patientModel.findOneAndDelete({
      $or: [{ nic }, { number }, { email }],
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ sucess: false, message: "Server error: " + error.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patient = await patientModel.find();
    res.status(200).send(patient);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const getOnePatient = async (req, res) => {
  try {
    const { nic, number, email } = req.body;
    if (!nic && !number && !email) {
      return res.status(400).json({
        success: false,
        message: "NIC/ Email or Phone number is required.",
      });
    }
    const patient = await patientModel.findOne({
      $or: [{ nic }, { number }, { email }],
    });
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }
    return res.status(200).send(patient);
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "Internal server error: " + error.message,
    });
  }
};

module.exports = {
  registerPatient,
  updatePatient,
  deletePatient,
  getAllPatients,
  getOnePatient,
};
