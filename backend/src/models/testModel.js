const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique:true,
  },
  price: {
    type: Number,
    require: true,
  },
  displayPrice: {
    type: String,
    require: true,
  },
});

const testModel = mongoose.model("Test", testSchema);

module.exports = testModel;
