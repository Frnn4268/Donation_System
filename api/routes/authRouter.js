const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Usuarios = require('../model/userModel')
const { default: helmet } = require('helmet')

router.use(helmet())

router.post('/login', async (req, res) => {
  try {
    // Get user input
    const { Email, PasswordHash } = req.body

    // Validate user input
    if (!(Email && PasswordHash)) {
      res.status(400).send('Todos los datos son requeridos')
      return
    }

    // Validate if user exists in your database
    const usuario = await Usuarios.findOne({ where: { Email } })

    if (!usuario) {
      res.status(401).json({ message: 'Correo o contraseña incorrecta' })
      return
    }

    const isPasswordValid = await bcrypt.compare(PasswordHash, usuario.PasswordHash)

    if (isPasswordValid) {
      // Create a token
      const token = jwt.sign(
        { user_id: usuario.UsuarioID, email: usuario.Email },
        process.env.TOKEN_KEY,
        { expiresIn: '2h' }
      )

      usuario.Token = token

      res.status(200).json({
        UsuarioID: usuario.UsuarioID,
        Nombre: usuario.Nombre,
        Apellido: usuario.Apellido,
        Email: usuario.Email,
        Rol: usuario.Rol,
        Activo: usuario.Activo,
        token
      })
    } else {
      res.status(401).json({ message: 'Correo o contraseña incorrecta' })
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
