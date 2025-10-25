// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function auth(requiredRoles = []) {
  return (req, res, next) => {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token" });

    try {
      const data = jwt.verify(token, process.env.JWT_SECRET || "secret");
      req.user = data; // { id, role }
      if (requiredRoles.length && !requiredRoles.includes(data.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (e) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
