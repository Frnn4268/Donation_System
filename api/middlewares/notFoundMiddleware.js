// notFoundMiddleware.js
const createError = require('http-errors')

function notFoundMiddleware (req, res, next) {
  next(createError(404))
}

module.exports = notFoundMiddleware
