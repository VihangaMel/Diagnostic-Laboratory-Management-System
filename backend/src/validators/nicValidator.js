const nicRegex = /(^\d{12}$)|(^\d{9}[vV]$)/;

const validateNIC = (nic) => {
  return nicRegex.test(nic);
};

module.exports = validateNIC;