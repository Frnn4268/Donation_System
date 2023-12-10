const session = require('express-session')
const app = require('./app')

app.use(session({
  secret: process.env.TOKEN_KEY,
  resave: false,
  saveUninitialized: true
}))
