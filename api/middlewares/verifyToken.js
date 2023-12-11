const jwt = require('jsonwebtoken') // Modules import
const secretKey = process.env.TOKEN_KEY

const verifyToken = (req, res, next) => { // Middleware for verifying the validity of an authentication token
  // Authentication header from the request
  const authHeader = req.headers.authorization // Check if the authorization header is present and get the token
  const token = authHeader && authHeader.split(' ')[1]
  console.log(authHeader)

  // Check if the token is absent
  if (token == null) { return res.status(401).send('Token required!') }

  // Verify the authenticity of the token using jsonwebtoken
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send('Invalid token!')
    console.log(user)
    req.user = user // Assign the user information to req.user so that it's available for other parts of the code
    next()
  })
}

module.exports = verifyToken
