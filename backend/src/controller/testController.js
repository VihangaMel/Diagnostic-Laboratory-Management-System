const testModel = require("../models/testModel");
const priceDecimalPlaces = require("../modules/priceDecimalPlaces");

const addTest = async (req, res) => {
  try {
    const { name, price } = req.body;

    const displayPrice = priceDecimalPlaces(price);

    if (!name || !price) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    const test = new testModel({
      name: name,
      price: price,
      displayPrice: displayPrice,
    });
    await test.save();
    return res
      .status(200)
      .json({ success: true, message: "Test added successfully." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const updateTest = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Test name is required." });
    }
    const displayPrice = priceDecimalPlaces(price);
    const test = await testModel.findOneAndUpdate(
      { name },
      { $set: { price, displayPrice } },
      { new: true }
    );

    if (!test) {
      return res.status(400).json({
        success: false,
        message: "Test not found. Please enter correct test name.",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Test price updated successfully." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const deleteTest = async (req, res) => {
  try {
    const name = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required." });
    }
    const test = await testModel.findOneAndDelete(name);
    if (!test) {
      return res.status(400).json({
        success: false,
        message: "Test not found. Please enter correct test name.",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Test deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

const getAllTests = async (req, res) => {
  try {
    const test = await testModel.find();
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Tests not found." });
    }
    return res.status(200).send(test);
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error: " + error.message,
      });
  }
};

const getATest=async(req,res)=>{
  try {
    const name=req.body;
    if(!name){
      return res.status(400).json({success:false,message:"Please enter test name."})
    }
    const test = await testModel.findOne(name);
    if(!test){
      return res.status(404).json({success:false,message:"Test not found."})
    }
    return res.status(200).send(test)
  } catch (error) {
    return res.status(500).json({success:false,message:"Internal server error: "+error.message})
  }
}

module.exports = { addTest, updateTest, deleteTest ,getAllTests,getATest};
