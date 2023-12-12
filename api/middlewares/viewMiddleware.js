// viewMiddleware.js
const path = require('path')

function viewMiddleware (app) {
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
}

module.exports = viewMiddleware
