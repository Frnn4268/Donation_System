const express = require('express')
const router = express.Router()
const cron = require('node-cron')
const nodemailer = require('nodemailer')

const Users = require('../model/userModel')

const { Sequelize } = require('sequelize')

// Configuración del servicio de correo electrónico
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'appstutorialesy@gmail.com',
    pass: 'regyrs ycvp ezqe yorp'
  }
})

// Programación de la tarea para enviar correos electrónicos cada 5 días
cron.schedule('* * */5 * *', async () => {
  // Obtener la fecha actual
  const currentDate = new Date()

  try {
    // Consultar la base de datos para obtener User con correos válidos
    const users = await Users.findAll({
      where: {
        Email: {
          [Sequelize.Op.ne]: null
        }
      }
    })

    for (const user of users) {
      // Comprobar si es hora de enviar un correo electrónico
      if (
        !user.UltimoEmailEnviado || // Nunca se ha enviado un correo
          (currentDate - user.UltimoEmailEnviado) / (1000 * 60 * 60 * 24) >= 5
      ) {
        // Enviar correo electrónico
        const mailOptions = {
          from: 'appstutorialesy@gmail.com',
          to: user.Email,
          subject: 'Sistema de Donaciones online, Dios te bendiga :)!',
          text: 'Querido usuario de nuestro Sistema de Donaciones, gracias por preferirnos :p'
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error al enviar el correo electrónico:', error)
          } else {
            console.log('Correo electrónico enviado:', info.response)
            // Actualizar la fecha del último correo electrónico enviado
            user.update({ UltimoEmailEnviado: currentDate })
          }
        })
      }
    }
  } catch (error) {
    console.error('Error al consultar la base de datos:', error)
  }
})

module.exports = router
