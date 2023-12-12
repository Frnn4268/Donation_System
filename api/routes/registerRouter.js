const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Usuarios = require('../model/userModel')

router.post('/', async (req, res) => {
  // Your register logic starts here
  try {
    // Get user input
    const { Nombre, Apellido, Email, PasswordHash, Rol, Activo } = req.body

    // Validate user input
    if (!(Nombre && Apellido && Email && PasswordHash)) {
      res.status(400).send('All input is required')
      return
    }

    // Check if user already exists
    // Validate if user exists in your database
    const existingUser = await Usuarios.findOne({ where: { Email } })

    if (existingUser) {
      res.status(409).send('User Already Exists. Please Login')
      return
    }

    // Encrypt user password
    const encryptedPassword = bcrypt.hashSync(PasswordHash, 10)

    // Create user in your database
    const newUser = await Usuarios.create({
      Nombre,
      Apellido,
      Email: Email.toLowerCase(), // Sanitize: convert email to lowercase
      PasswordHash: encryptedPassword,
      Rol,
      Activo
    })

    // Create a token
    const token = jwt.sign(
      { user_id: newUser.id, email: newUser.Email },
      process.env.TOKEN_KEY,
      { expiresIn: '2h' }
    )

    // Save the user's token
    newUser.Token = token

    // Return the new user and token
    res.status(201).json(newUser)
  } catch (err) {
    console.log(err)
    res.status(500).json()
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const usuario = await Usuarios.findByPk(id)

  if (usuario) {
    res.status(200).json(usuario)
  } else {
    res.status(404).json()
  }
})

module.exports = router
