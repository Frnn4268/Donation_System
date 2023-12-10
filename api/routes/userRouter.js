const express = require('express')
const router = express.Router()

const Users = require('../model/userModel')
const verifyToken = require('../middlewares/verifyToken')

router.use(verifyToken)

router.get('/', async (req, res) => {
  const users = await Users.findAll()
  res.status(200).json(users)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const usuario = await Users.findByPk(id)

  if (usuario) {
    res.status(200).json(usuario)
  } else {
    res.status(404).json()
  }
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const dataUsuarios = req.body

  try {
    const updatedRows = await Users.update(
      {
        Nombre: dataUsuarios.Nombre,
        Apellido: dataUsuarios.Apellido,
        Email: dataUsuarios.Email,
        PasswordHash: dataUsuarios.PasswordHash,
        Rol: dataUsuarios.Rol,
        Activo: dataUsuarios.Activo
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
    res.status(500).json()
  }
})

module.exports = router
