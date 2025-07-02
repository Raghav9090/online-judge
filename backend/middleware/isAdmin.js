module.exports = (req, res, next) => {
  if (req.curruser?.role !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
};
// This middleware checks if the current user has an admin role.
// If not, it responds with a 403 status code and an error message. 