// Domain error carrying an HTTP status, so services can signal intent
// (401/403/404/409/...) without each controller mapping messages by hand.
class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}

module.exports = AppError;
