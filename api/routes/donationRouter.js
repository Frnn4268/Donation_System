const express = require('express')
const router = express.Router()
const sql = require('mssql')
const { config } = require('../config/sqlServer')

const verifyToken = require('../middlewares/verifyToken')

router.use(verifyToken)

router.post('/', async (req, res, next) => {
  const donation = req.body

  console.log('Donacion recibida:', donation)

  try {
    const connection = await sql.connect(config)

    const proyecto = await connection
      .request()
      .input('ProyectoID', sql.Int, donation.ProyectoID)
      .query('SELECT MetaTotal FROM Proyectos WHERE ProyectoID = @ProyectoID')

    const montoTotalProyecto = proyecto.recordset[0].MetaTotal

    console.log('Total amount before donation: ', montoTotalProyecto)

    if (montoTotalProyecto >= donation.Monto) {
      const transaction = new sql.Transaction(connection)

      transaction.begin(async (err) => {
        if (err) {
          console.error(err)
          res.status(500).json({ error: 'Error while doing the donation' })
          return
        }

        try {
          const resultDonaciones = await connection
            .request()
            .input('DonanteID', sql.Int, donation.DonanteID)
            .input('EmpleadoID', sql.Int, donation.EmpleadoID)
            .input('ProyectoID', sql.Int, donation.ProyectoID)
            .input('FechaDonacion', sql.DateTime, donation.FechaDonacion)
            .input('Monto', sql.Decimal(10, 2), donation.Monto)
            .input('BoletaDeposito', sql.VarChar(255), donation.BoletaDeposito)
            .input('Estado', sql.VarChar(50), donation.Estado)
            .query(
              'INSERT INTO Donaciones (DonanteID, EmpleadoID, ProyectoID, FechaDonacion, Monto, BoletaDeposito, Estado) VALUES (@DonanteID, @EmpleadoID, @ProyectoID, @FechaDonacion, @Monto, @BoletaDeposito, @Estado)'
            )

          console.log('Donation results:', resultDonaciones)

          await connection
            .request()
            .input('ProyectoID', sql.Int, donation.ProyectoID)
            .input('MontoDonado', sql.Decimal(10, 2), donation.Monto)
            .query(
              'UPDATE Proyectos SET MetaTotal = MetaTotal - @MontoDonado WHERE ProyectoID = @ProyectoID'
            )

          console.log('Total amount before donation: ', montoTotalProyecto - donation.Monto)

          transaction.commit((err) => {
            if (err) {
              console.error(err)
              res.status(500).json({ error: 'Error while doing the donation' })
              return
            }
            res.status(200).json(resultDonaciones.rowsAffected)
          })
        } catch (err) {
          console.error(err)
          transaction.rollback(() => {
            res.status(500).json({ error: 'Error while doing the donation' })
          })
        }
      })
    } else {
      res.status(400).json({ error: 'Insufficient funds in the project' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error while doing the donation' })
  }
})

module.exports = router
