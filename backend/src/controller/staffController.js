const staffModel = require("../models/staffModel");
const validateEmail = require("../validators/emailValidator");
const validateNIC = require("../validators/nicValidator");
const validatePhoneNumber = require("../validators/phoneNumberValidator");
const bcrypt = require("bcryptjs");
const genarateJWTToken = require("../modules/genarateJWTToken");
const genarateReserPasswordCode = require("../modules/genarateResetPassowrdCode");
const resetPasswordEmail = require("../modules/email/resetPassowrdEmail");

const registerStaff = async (req, res) => {
  try {
    const { nic, email, number, password, name, gender, age, address } =
      req.body;
    if (!validateNIC(nic)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid NIC format." });
    }
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }
    if (!validatePhoneNumber(number)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid number format." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const staff = new staffModel({
      nic: nic,
      email: email,
      number: number,
      password: hashedPassword,
      name: name,
      gender: gender,
      age: age,
      address: address,
    });
    await staff.save();
    return res.status(200).json({
      success: true,
      message: "Staff member registered successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const loginStaff = async (req, res) => {
  try {
    const { nic, number, email, password } = req.body;
    // console.log(nic, number, email, password);
    if (!nic && !number && !email) {
      return res.status(400).json({
        success: false,
        message: "NIC/ Email or Phone number is required.",
      });
    }
    const staffMember = await staffModel.findOne({
      $or: [{ nic }, { email }, { number }],
    });
    // console.log(staffMember);

    if (!staffMember) {
      return res.status(404).json({
        success: false,
        message:
          "Staff member not found. Please check your NIC/ Email or Phone number.",
      });
    }

    const isMatch = await bcrypt.compare(password, staffMember.password);
    // console.log(isMatch)

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect. Try again." });
    }

    memberNic = staffMember.nic;
    memberEmail = staffMember.email;
    memberNumber = staffMember.number;

    const genaratedToken = await genarateJWTToken(
      res,
      memberNic,
      memberEmail,
      memberNumber
    );
    // console.log(genaratedToken)

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

const updateStaff = async (req, res) => {
  try {
    const { nic, email, number} = req.body;
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
        message: "NIC/ Email or phone number is required to update patient.",
      });
    }

    const updatedStaffMember = await staffModel.findOneAndUpdate(
      {
        $or: [{ nic }, { email }, { number }],
      },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStaffMember) {
      return res.status(404).json({
        success:
          "Staff member not found. Please check your NIC/ Email or Phone number.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff member updated successfully",
      data: updatedStaffMember,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { nic, email, number } = req.body;
    if (!nic && !email && !number) {
      return res.status(400).json({
        success: false,
        message:
          "NIC/ Email or phone number is required to delete staff member.",
      });
    }

    const staffMember = await staffModel.findOneAndDelete({
      $or: [{ nic }, { email }, { number }],
    });

    if (!staffMember) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Staff member deleted successfully!" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const getStaffMemberById = async (req, res) => {
  try {
    const email = req.email;

    const staffMember = await staffModel.findOne({ email });

    if (!staffMember) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found." });
    }

    return res.status(200).json(staffMember);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const getOneStaff = async (req, res) => {
  try {
    const { nic, email, number } = req.body;

    if (!nic && !email && !number) {
      return res.status(400).json({
        success: false,
        message:
          "NIC/ Email or phone number is required to find a staff member.",
      });
    }

    const staffMember = await staffModel.findOne({
      $or: [{ nic }, { email }, { number }],
    });

    if (!staffMember) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found." });
    }

    return res.status(200).send(staffMember);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.messsge,
    });
  }
};

const getAllStaff = async (req, res) => {
  try {
    const staffMembers = await staffModel.find();
    if (!staffMembers) {
      return res
        .status(404)
        .json({ success: false, message: "Staff members not found." });
    }
    return res.status(200).send(staffMembers);
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
    const staffMember = await staffModel.findOne(email);

    if (!staffMember) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found, please enter registered email.",
      });
    }

    memberNic = staffMember.nic;
    memberEmail = staffMember.email;
    memberNumber = staffMember.number;

    const genaratedToken = await genarateJWTToken(
      res,
      memberNic,
      memberEmail,
      memberNumber
    );

    const resetPsswordCode = genarateReserPasswordCode();

    await resetPasswordEmail(staffMember.email, resetPsswordCode);

    staffMember.resetPsswordCode = resetPsswordCode;
    await staffMember.save();

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
    const staffMember = await staffModel.findOne({ email: email });
    if (!staffMember) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found." });
    }
    const trueResetPsswordCode = staffMember.resetPsswordCode;

    if (resetPsswordCode != trueResetPsswordCode) {
      return res
        .status(400)
        .json({ success: false, message: "Reset code is wrong." });
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    staffMember.password = hashedPassword;
    await staffMember.save();
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

const staffCount = async (req, res) => {
  try {
    const staffCount = await staffModel.countDocuments();
    return res.status(200).json({ success: true, message: staffCount });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal server error: " + error.message,
    });
  }
};

module.exports = {
  registerStaff,
  loginStaff,
  updateStaff,
  deleteStaff,
  getStaffMemberById,
  getAllStaff,
  getOneStaff,
  staffCount,
  sentResetPasswordCode,
  resetPassword,
};
