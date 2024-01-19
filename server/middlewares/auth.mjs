import jwt from "jwt-then";

const middleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log("Unauthorized: No token provided"); // Added console log
      throw "Unauthorized: No token provided";
    }
    const token = req.headers.authorization.split(" ")[1];
    const payload = await jwt.verify(token, process.env.SECRET);
    req.payload = payload;
    console.log("Token verified successfully."); // Added console log
    next();
  } catch (err) {
    console.error("Token verification error:", err); // Added console log
    res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }
};

export default middleware;
