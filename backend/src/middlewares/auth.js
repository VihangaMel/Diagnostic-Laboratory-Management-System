const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.email = decoded.email;
    req.nic = decoded.nic;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

module.exports = auth;
