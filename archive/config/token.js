const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
}

module.exports = generateToken;
