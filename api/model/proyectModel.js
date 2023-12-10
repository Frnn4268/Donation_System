const { Sequelize, Model, DataTypes } = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

const sequelize = new Sequelize({
  dialect: 'mssql',
  host: 'DESKTOP-MFTH7BM\\EXAMPLE_SQL',
  port: 1433, // Puerto por defecto de SQL Server
  username: 'sa',
  password: '1234',
  database: 'SistemaDonaciones'
})

class Proyects extends Model {}

Proyects.init(
  {
    ProyectoID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    NombreProyecto: {
      type: DataTypes.STRING
    },
    DescripcionProyecto: {
      type: DataTypes.STRING
    },
    EmpleadoID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuario',
        key: 'UsuarioID'
      }
    },
    NombreEmpleado: {
      type: DataTypes.STRING
    },
    ApellidoEmpleado: {
      type: DataTypes.STRING
    },
    MetaTotal: {
      type: DataTypes.DECIMAL(10, 2)
    },
    EstadoProyecto: {
      type: DataTypes.STRING
    },
    DocumentoSoporte: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Proyect',
    timestamps: false
  }
)

module.exports = Proyects
