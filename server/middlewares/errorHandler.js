const errorParser = require("../util/errorParser");

// Single place that turns thrown errors into HTTP responses.
// Known shapes map to specific status codes; anything unrecognized is a 500
// with a generic message so internal details are not leaked to clients.
module.exports = (err, req, res, next) => {
  // express-validator collects errors into an array.
  if (Array.isArray(err)) {
    return res.status(422).json({ message: errorParser(err) });
  }

  // Mongoose schema validation.
  if (err.name === "ValidationError") {
    return res.status(422).json({ message: errorParser(err) });
  }

  // Malformed ObjectId / cast failure.
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifier" });
  }

  // Mongoose duplicate key (e.g. unique email under a race).
  if (err.code === 11000) {
    return res.status(409).json({ message: "Resource already exists" });
  }

  // AppError (or anything carrying an explicit numeric status).
  if (typeof err.status === "number") {
    return res.status(err.status).json({ message: err.message });
  }

  // Unexpected: log for the server, return a generic 500 to the client.
  console.error("[error]", err);
  return res.status(500).json({ message: "Something went wrong" });
};
