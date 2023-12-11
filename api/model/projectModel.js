const { Model, DataTypes } = require('sequelize') // Importación de módulos
const { sequelize } = require('../middlewares/databaseMiddleware')

class Projects extends Model {}

Projects.init(
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
    modelName: 'Proyecto',
    timestamps: false
  }
)

module.exports = Projects
