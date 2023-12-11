const { Model, DataTypes } = require('sequelize') // Importing modules
const { sequelize } = require('../middlewares/databaseMiddleware')

class Donations extends Model {} // Define a class named Donations that extends the Sequelize

// Initialize the Donations model with specific atributes
Donations.init(
  {
    DonacionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    DonanteID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    EmpleadoID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuario',
        key: 'UsuarioID'
      }
    },
    ProyectoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Proyecto',
        key: 'ProyectoID'
      }
    },
    FechaDonacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    BoletaDeposito: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Estado: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Donacion',
    timestamps: false
  }
)

module.exports = Donations
