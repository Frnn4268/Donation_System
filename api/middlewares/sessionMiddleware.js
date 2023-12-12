// sessionMiddleware.js
const session = require('express-session')
require('dotenv').config()

const sessionMiddleware = () => {
  return session({
    secret: process.env.TOKEN_KEY,
    resave: false,
    saveUninitialized: true
  })
}

module.exports = sessionMiddleware
