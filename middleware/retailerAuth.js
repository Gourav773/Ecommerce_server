const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const token = req.cookies?.token;

  console.log("Token:", token); // 🔍 debug

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  jwt.verify(token, "jwt-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.email = decoded.email;
    req.regno = decoded.regID;

    next();
  });
};

module.exports = verifyUser; // ✅ VERY IMPORTANT