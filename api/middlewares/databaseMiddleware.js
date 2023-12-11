const { Sequelize } = require('sequelize') // Importación de módulos
require('dotenv').config()

const sequelize = new Sequelize({
  dialect: 'mssql',
  host: process.env.SERVER,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

async function testConnection (req, res, next) {
  try {
    await sequelize.authenticate()
    console.log('Connection to the database has been established successfully.')
    req.db = sequelize
    next()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    res.status(500).send('Internal Server Error')
  }
}

module.exports = { sequelize, testConnection }
