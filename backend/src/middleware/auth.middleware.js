const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key" // store in .env, never hardcode

const authenticateToken = (req, res, next) => {
  // Token usually comes in: Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // extract after "Bearer"


  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // attach user payload to request
    next();             // token is valid, proceed
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;