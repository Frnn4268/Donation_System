const { Model, DataTypes } = require('sequelize') // Importing modules
const { sequelize } = require('../middlewares/databaseMiddleware')

class Projects extends Model {} // Define a class named Projects that extends the Sequelize

// Initialize the Projects model with specific atributes
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
        model: 'Usuarios',
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
    modelName: 'Proyectos',
    timestamps: false
  }
)

module.exports = Projects
