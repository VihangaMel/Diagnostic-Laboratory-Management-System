const validator = require("validator");

const validatePhoneNumber = (number) => {
  return validator.isMobilePhone(number, "si-LK");
};

module.exports = validatePhoneNumber;
