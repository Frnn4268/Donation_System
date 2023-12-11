const express = require('express') // Importing modules
const router = express.Router()

const Users = require('../model/userModel') // Importing models
const verifyToken = require('../middlewares/verifyToken')

router.use(verifyToken)

// Route to get all users
router.get('/', async (req, res) => {
  try {
    const users = await Users.findAll()
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching users.' })
  }
})

// Route to get a specific user by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const user = await Users.findByPk(id)

    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json()
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching user.' })
  }
})

// Route to update a user by ID
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const userData = req.body

  try {
    const updatedRows = await Users.update(
      {
        Nombre: userData.Nombre,
        Apellido: userData.Apellido,
        Email: userData.Email,
        PasswordHash: userData.PasswordHash,
        Rol: userData.Rol,
        Activo: userData.Activo
      },
      {
        where: {
          UsuarioID: id
        }
      }
    )

    if (updatedRows > 0) {
      res.status(200).json()
    } else {
      res.status(404).json()
    }
  } catch (error) {
    console.error(error)
    res.status(500).json()
  }
})

module.exports = router
