const express = require('express') // Importing modules
const router = express.Router()
const multer = require('multer')
const upload = multer()

const Project = require('../model/projectModel') // Importing models
const Donation = require('../model/donationModel')
const verifyToken = require('../middlewares/verifyToken') // Importing the token checker

router.use(verifyToken)

// Route to save a new donation
router.post('/', upload.single('archivo'), async (req, res) => {
  try {
    const {
      DonanteID,
      EmpleadoID,
      ProyectoID,
      FechaDonacion,
      Monto,
      BoletaDeposito,
      Estado
    } = req.body

    // Create a new donation in the db
    const newDonation = await Donation.create({
      DonanteID,
      EmpleadoID,
      ProyectoID,
      FechaDonacion,
      Monto,
      BoletaDeposito,
      Estado
    })

    // Load the file if exists
    if (req.file) {
      const archivoData = req.file.buffer
      newDonation.DocumentoSoporte = archivoData
      await newDonation.save()
    }

    // Obtains the project asociated to doantion
    const project = await Project.findByPk(ProyectoID)

    // Update the goal of the Project
    if (project) {
      project.MetaTotal -= Monto
      await project.save()
    }

    res.status(201).json(newDonation)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error processing the donation.' })
  }
})

// Route to get all donations made by the logged-in user
router.get('/my-donations', async (req, res) => {
  try {
    const userId = req.user.user_id // User information is stored in req.user

    const userDonations = await Donation.findAll({
      where: { DonanteID: userId }
    })

    res.status(200).json(userDonations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching user donations.' })
  }
})

module.exports = router
