const { validationResult } = require("express-validator");

// Runs after express-validator checks. Forwards collected errors as an array
// to the central error handler (which maps it to 422).
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(result.array());
  }
  next();
};
