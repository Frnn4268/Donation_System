const config = {
  server: process.env.SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true
  }
}

module.exports.config = config
