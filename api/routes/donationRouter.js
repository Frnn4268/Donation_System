const express = require('express') // Importing modules
const router = express.Router()

const Project = require('../model/projectModel') // Importing models
const Donation = require('../model/donationModel')
const verifyToken = require('../middlewares/verifyToken') // Importing the token checker

router.use(verifyToken)

// Route to save a new donation
router.post('/', async (req, res) => {
  try {
    // Get donation data from the request body
    const {
      DonanteID,
      EmpleadoID,
      ProyectoID,
      FechaDonacion,
      Monto,
      BoletaDeposito,
      Estado
    } = req.body

    // Create a new donation in the database
    const newDonation = await Donation.create({
      DonanteID,
      EmpleadoID,
      ProyectoID,
      FechaDonacion,
      Monto,
      BoletaDeposito,
      Estado
    })

    // Get the project associated with the donation
    const project = await Project.findByPk(ProyectoID)

    // Update the total goal of the project by subtracting the donation amount
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
