const validateEmail = require("../validators/emailValidator");
const validateNIC = require("../validators/nicValidator");
const validatePhoneNumber = require("../validators/phoneNumberValidator");
const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const genarateJWTToken = require("../modules/genarateJWTToken");
const resetPasswordEmail = require("../modules/email/resetPassowrdEmail");
const genarateReserPasswordCode = require("../modules/genarateResetPassowrdCode");

const doctorRegister = async (req, res) => {
  try {
    const { nic, email, number, name, password, gender, age, address } =
      req.body;

    if (!validateNIC(nic)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid NIC format." });
    }

    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email format." });
    }

    if (!validatePhoneNumber(number)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Phone number format." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new doctorModel({
      nic: nic,
      email: email,
      number: number,
      password: hashedPassword,
      name: name,
      gender: gender,
      age: age,
      address: address,
    });
    await doctor.save();
    return res
      .status(200)
      .json({ success: true, message: "Doctoer regitered successfully!" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const doctorLogin = async (req, res) => {
  try {
    const { email, number, nic, password } = req.body;

    if (!email && !number && !nic) {
      return res.status(400).json({
        success: false,
        message: "NIC/ Email or Phone number is required.",
      });
    }

    const doctor = await doctorModel.findOne({
      $or: [{ email }, { number }, { nic }],
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message:
          "Doctor not found. Please check your NIC/ Email or Phone number.",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect. Try again." });
    }

    doctorNic = doctor.nic;
    doctorEmail = doctor.email;
    doctorNumber = doctor.number;

    const genaratedToken = await genarateJWTToken(
      res,
      doctorNic,
      doctorEmail,
      doctorNumber
    );

    return res.status(200).json({
      success: true,
      token: genaratedToken,
      message: "Login successful!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const doctorUpdate = async (req, res) => {
  try {
    const { nic, email, number } = req.body;
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
      if (req.body[key] && key !== "nic" && key !== "password") {
        updateData[key] = req.body[key];
      }
    }

    if (!nic && !number && !email) {
      return res.status(400).json({
        success: false,
        message: "NIC/ Email or phone number is required to update doctor.",
      });
    }

    const updatedDoctor = await doctorModel.findOneAndUpdate(
      {
        $or: [{ nic }, { number }, { email }],
      },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success:
          "Doctor not found. Please check your NIC/ Email or Phone number.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully.",
      data: updatedDoctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const doctorUpdateByToken = async (req, res) => {
  try {
    const nic = req.nic;
    const {number,email}=req.body;
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
      if (req.body[key] && key !== "nic" && key !== "password") {
        updateData[key] = req.body[key];
      }
    }

    //   console.log(updateData)
    //   console.log(nic)

    if (!nic) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }

    const updatedDoctor = await doctorModel.findOneAndUpdate(
      {
        nic,
      },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success:
          "Doctor not found. Please check your NIC/ Email or Phone number.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const doctorDelete = async (req, res) => {
  const { email, number, nic } = req.body;
  if (!email && !number && !nic) {
    return res.status(400).json({
      success: false,
      message: "NIC/ Email or phone number is required to update doctor.",
    });
  }
  const doctor = await doctorModel.findOneAndDelete({
    $or: [{ nic }, { email }, { number }],
  });

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message:
        "Doctor not found. Please check your NIC/ Email or Phone number.",
    });
  }

  return res
    .status(200)
    .json({ success: true, message: "Doctor deleted successfully." });
};

const doctorDeleteByToken = async (req, res) => {
  try {
    const email = req.email;

    if (!email) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const doctor = await doctorModel.findOneAndDelete(email);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const email = req.email;

    if (!email) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const getOneDoctor = async (req, res) => {
  try {
    const { email, nic, number } = req.body;

    if (!email && !nic && !number) {
      return res.status(400).json({
        success: false,
        message: "NIC/ Email or phone number is required to find a doctor.",
      });
    }

    const doctor = await doctorModel.findOne({
      $or: [{ nic }, { number }, { email }],
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message:
          "Doctor not found. Please check your NIC/ Email or Phone number.",
      });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    if (!doctors) {
      return res
        .status(404)
        .json({ success: false, message: "Doctors not found." });
    }
    return res.status(200).send(doctors);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const sentResetPasswordCode = async (req, res) => {
  try {
    const email = req.body;
    const doctor = await doctorModel.findOne(email);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found, please enter registered email.",
      });
    }

    doctorNic = doctor.nic;
    doctorEmail = doctor.email;
    doctorNumber = doctor.number;

    const genaratedToken = await genarateJWTToken(
      res,
      doctorNic,
      doctorEmail,
      doctorNumber
    );

    const resetPsswordCode = genarateReserPasswordCode();

    await resetPasswordEmail(doctor.email, resetPsswordCode);

    doctor.resetPsswordCode = resetPsswordCode;
    await doctor.save();

    return res.status(200).json({
      success: true,
      token: genaratedToken,
      message: "Reset password was sent.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { new_password, resetPsswordCode } = req.body;
    const email = req.email;

    const doctor = await doctorModel.findOne({ email: email });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found." });
    }

    const trueResetPsswordCode = doctor.resetPsswordCode;

    if (resetPsswordCode != trueResetPsswordCode) {
      return res
        .status(400)
        .json({ success: false, message: "Reset code is wrong." });
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    doctor.password = hashedPassword;
    await doctor.save();
    return res
      .status(200)
      .json({ success: true, message: "Password was reseted." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const doctorCount = async (req, res) => {
  try {
    const doctorCount = await doctorModel.countDocuments();
    return res.status(200).json({ success: true, message: doctorCount });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

module.exports = {
  doctorRegister,
  doctorLogin,
  doctorUpdate,
  doctorUpdateByToken,
  doctorDelete,
  doctorDeleteByToken,
  getDoctorById,
  getOneDoctor,
  getAllDoctors,
  sentResetPasswordCode,
  resetPassword,
  doctorCount,
};
