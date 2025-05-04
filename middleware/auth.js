const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// checking and verifying authentication tokens
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access Denied: No Token Provided" });
    }
  
    const token = authHeader.split(" ")[1];
    console.log('JWT Token : ',token)
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // attach user info to request object
      next(); // proceed to the next middleware or route
    } catch (err) {
      return res.status(403).json({ message: "Invalid or Expired Token" });
    }
  }

module.exports = auth;