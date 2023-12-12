const cors = require('cors')
require('dotenv').config()

const corsOptions = () => {
  return cors({
    origin: process.env.FRONTEND_DOMAIN, // Put Digital Ocean domain
    credentials: true
  })
}

module.exports = corsOptions
