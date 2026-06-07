// Express 4 does not forward rejected promises from async handlers to the
// error middleware. Wrap handlers so any throw/rejection reaches next(err).
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
