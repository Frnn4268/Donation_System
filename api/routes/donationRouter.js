const express = require('express')
const router = express.Router()

const Project = require('../model/projectModel')
const Donation = require('../model/donationModel')
const verifyToken = require('../middlewares/verifyToken')

router.use(verifyToken)

// Ruta para guardar una nueva donación
router.post('/', async (req, res) => {
  try {
    // Obtén los datos de la donación desde el cuerpo de la solicitud
    const {
      DonanteID,
      EmpleadoID,
      ProyectoID,
      FechaDonacion,
      Monto,
      BoletaDeposito,
      Estado
    } = req.body

    // Crea una nueva donación en la base de datos
    const newDonation = await Donation.create({
      DonanteID,
      EmpleadoID,
      ProyectoID,
      FechaDonacion,
      Monto,
      BoletaDeposito,
      Estado
    })

    // Obtén el proyecto asociado a la donación
    const project = await Project.findByPk(ProyectoID)

    // Actualiza la meta total del proyecto sumándole el monto de la donación
    if (project) {
      project.MetaTotal -= Monto
      await project.save()
    }

    res.status(201).json(newDonation)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al procesar la donación.' })
  }
})

module.exports = router
