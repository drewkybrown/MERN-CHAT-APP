import jwt from "jwt-then";

const middleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log("Unauthorized: No token provided");
      throw "Unauthorized: No token provided";
    }
    const token = req.headers.authorization.split(" ")[1];
    const payload = await jwt.verify(token, process.env.SECRET);
    req.payload = payload;

    // Log the payload to the console
    console.log("JWT Payload:", payload);

    console.log("Token verified successfully.");
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }
};

export default middleware;
