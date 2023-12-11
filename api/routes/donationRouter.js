const express = require('express')
const router = express.Router()
const { Projects } = require('../model/projectModel') // Importar los modelos de Sequelize
const { Donations } = require('../model/donationModel')

const verifyToken = require('../middlewares/verifyToken')

router.use(verifyToken)

router.post('/', async (req, res, next) => {
  const donation = req.body

  console.log('Donación recibida:', donation)

  try {
    const project = await Projects.findByPk(donation.ProyectoID)

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' })
    }

    const totalProjectAmount = project.MetaTotal

    console.log('Monto total del proyecto antes de la donación:', totalProjectAmount)

    if (totalProjectAmount >= donation.Monto) {
      try {
        const donationResult = await Donations.create({
          DonanteID: donation.DonanteID,
          EmpleadoID: donation.EmpleadoID,
          ProyectoID: donation.ProyectoID,
          FechaDonacion: donation.FechaDonacion,
          Monto: donation.Monto,
          BoletaDeposito: donation.BoletaDeposito,
          Estado: donation.Estado
        })

        console.log('Resultados de la donación:', donationResult)

        await Projects.update(
          { MetaTotal: totalProjectAmount - donation.Monto },
          { where: { ProyectoID: donation.ProyectoID } }
        )

        console.log('Monto total del proyecto después de la donación:', totalProjectAmount - donation.Monto)

        res.status(200).json(donationResult)
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al realizar la donación' })
      }
    } else {
      res.status(400).json({ error: 'Fondos insuficientes en el proyecto' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al realizar la donación' })
  }
})

module.exports = router
