// cspMiddleware.js
const helmet = require('helmet')

function cspMiddleware (req, res, next) {
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-cdn.com'],
      styleSrc: ["'self'", 'fonts.googleapis.com'],
      scriptSrcElem: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrcElem: ["'self'"],
      styleSrcAttr: ["'none'"]
    }
  })(req, res, next)
}

module.exports = cspMiddleware
