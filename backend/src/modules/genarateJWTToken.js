const jwtToken = require("jsonwebtoken");

const genarateJWTToken = async (res, nic, email, number) => {
  const token = jwtToken.sign(
    {
      nic,
      email,
      number,
    },
    process.env.SECRETE_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_LIFE_TIME }
  );
  res.cookie("token", token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  return token;
};

module.exports = genarateJWTToken;
