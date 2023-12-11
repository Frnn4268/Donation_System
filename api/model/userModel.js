const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../middlewares/databaseMiddleware')

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
    modelName: 'Usuario',
    timestamps: false
  }
)

module.exports = Users
