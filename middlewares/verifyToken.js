import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("Received request:", req.method, req.url);
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    console.log("Token:", token);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    console.log("Verified User:", req.user);

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token." });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    }
    res.status(500).json({ error: err.message });
  }
};
