const express = require('express') // Importing modules
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { default: helmet } = require('helmet') // Importing models for security headers

const Users = require('../model/userModel') // Importing Model called userModel

router.use(helmet())

router.post('/login', async (req, res) => { // Route for user login
  try {
    // Get user input from the request body
    const { Email, PasswordHash } = req.body

    if (!(Email && PasswordHash)) { // Validate user input
      res.status(400).send('All inputs are required!')
      return
    }

    // Check if the user exists in the database
    const user = await Users.findOne({ where: { Email } })
    if (!user) {
      res.status(401).json({ message: 'Incorrect Email or password' })
      return
    }

    // Password validate
    const isPasswordValid = await bcrypt.compare(PasswordHash, user.PasswordHash)

    if (isPasswordValid) {
      // Create a JWT token
      const token = jwt.sign(
        { user_id: user.UsuarioID, email: user.Email },
        process.env.TOKEN_KEY,
        { expiresIn: '2h' }
      )

      user.Token = token

      res.status(200).json({ // Respond with user details and the token
        UsuarioID: user.UsuarioID,
        Nombre: user.Nombre,
        Apellido: user.Apellido,
        Email: user.Email,
        Rol: user.Rol,
        Activo: user.Activo,
        token
      })
    } else {
      res.status(401).json({ message: 'Incorrect Email or password' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json()
  }
})

router.get('/logout', async (req, res, next) => { // Define a route for user logout
  req.session.UsuarioID = null // Clear the user session
  res.send(200)
})

module.exports = router
