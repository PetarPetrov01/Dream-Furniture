const { authCookieName } = require("../config/cookie.js");
const authService = require("../services/authService.js");

module.exports = () => (req, res, next) => {
  const token = req.cookies[authCookieName];

  if (token) {
    try {
      req.user = authService.verifyToken(token);
    } catch (error) {
      // Invalid or expired token: drop the bad cookie and continue as a guest.
      // Guards still reject protected routes; public routes stay accessible.
      res.clearCookie(authCookieName);
    }
  }

  next();
};
