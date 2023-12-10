const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Users = require('../model/userModel')
const { default: helmet } = require('helmet')

router.use(helmet())

router.post('/login', async (req, res) => {
  try {
    // Get user input
    const { Email, PasswordHash } = req.body

    // Validate user input
    if (!(Email && PasswordHash)) {
      res.status(400).send('All inputs are required')
      return
    }

    // Validate if user exists in your database
    const user = await Users.findOne({ where: { Email } })

    if (!user) {
      res.status(401).json({ message: 'Invalid password or Email' })
      return
    }

    const isPasswordValid = await bcrypt.compare(PasswordHash, user.PasswordHash)

    if (isPasswordValid) {
      // Create a token
      const token = jwt.sign(
        { user_id: user.UsuarioID, email: user.Email },
        process.env.TOKEN_KEY,
        { expiresIn: '2h' }
      )

      user.Token = token

      res.status(200).json({
        UsuarioID: user.UsuarioID,
        Nombre: user.Nombre,
        Apellido: user.Apellido,
        Email: user.Email,
        Rol: user.Rol,
        Activo: user.Activo,
        token
      })
    } else {
      res.status(401).json({ message: 'Invalid password or Email' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json()
  }
})

router.get('/logout', async (req, res, next) => {
  req.session.UsuarioID = null
  res.send(200)
})

module.exports = router
