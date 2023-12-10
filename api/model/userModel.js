const { Sequelize, Model, DataTypes } = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

const sequelize = new Sequelize({
  dialect: 'mssql',
  host: process.env.SERVER,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

class Users extends Model {}

Users.init(
  {
    UsuarioID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nombre: {
      type: DataTypes.STRING
    },
    Apellido: {
      type: DataTypes.STRING
    },
    Email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    PasswordHash: {
      type: DataTypes.STRING
    },
    Rol: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['Empleado', 'Donador']]
      }
    },
    Activo: {
      type: DataTypes.BOOLEAN
    },
    Token: {
      type: DataTypes.STRING
    },
    UltimoEmailEnviado: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: false
  }
)

module.exports = Users

async function testConnection () {
  try {
    await sequelize.authenticate()
    console.log('Connected to database!')
  } catch (err) {
    console.error('Cant connect to database', err)
  }
}

testConnection()
