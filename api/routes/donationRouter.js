const express = require('express')
const router = express.Router()
const sql = require('mssql')
const { config } = require('../config/sqlServer')

const verifyToken = require('../middlewares/verifyToken')

router.use(verifyToken)

router.post('/', async (req, res, next) => {
  const donacion = req.body

  console.log('Donacion recibida:', donacion)

  try {
    const connection = await sql.connect(config)

    const proyecto = await connection
      .request()
      .input('ProyectoID', sql.Int, donacion.ProyectoID)
      .query('SELECT MetaTotal FROM Proyectos WHERE ProyectoID = @ProyectoID')

    const montoTotalProyecto = proyecto.recordset[0].MetaTotal

    console.log('Monto total del proyecto antes de la donación:', montoTotalProyecto)

    if (montoTotalProyecto >= donacion.Monto) {
      const transaction = new sql.Transaction(connection)

      transaction.begin(async (err) => {
        if (err) {
          console.error(err)
          res.status(500).json({ error: 'Error al realizar la donación' })
          return
        }

        try {
          const resultDonaciones = await connection
            .request()
            .input('DonanteID', sql.Int, donacion.DonanteID)
            .input('EmpleadoID', sql.Int, donacion.EmpleadoID)
            .input('ProyectoID', sql.Int, donacion.ProyectoID)
            .input('FechaDonacion', sql.DateTime, donacion.FechaDonacion)
            .input('Monto', sql.Decimal(10, 2), donacion.Monto)
            .input('BoletaDeposito', sql.VarChar(255), donacion.BoletaDeposito)
            .input('Estado', sql.VarChar(50), donacion.Estado)
            .query(
              'INSERT INTO Donaciones (DonanteID, EmpleadoID, ProyectoID, FechaDonacion, Monto, BoletaDeposito, Estado) VALUES (@DonanteID, @EmpleadoID, @ProyectoID, @FechaDonacion, @Monto, @BoletaDeposito, @Estado)'
            )

          console.log('Resultados de la donación:', resultDonaciones)

          await connection
            .request()
            .input('ProyectoID', sql.Int, donacion.ProyectoID)
            .input('MontoDonado', sql.Decimal(10, 2), donacion.Monto)
            .query(
              'UPDATE Proyectos SET MetaTotal = MetaTotal - @MontoDonado WHERE ProyectoID = @ProyectoID'
            )

          console.log('Monto total del proyecto después de la donación:', montoTotalProyecto - donacion.Monto)

          transaction.commit((err) => {
            if (err) {
              console.error(err)
              res.status(500).json({ error: 'Error al realizar la donación' })
              return
            }
            res.status(200).json(resultDonaciones.rowsAffected)
          })
        } catch (err) {
          console.error(err)
          transaction.rollback(() => {
            res.status(500).json({ error: 'Error al realizar la donación' })
          })
        }
      })
    } else {
      res.status(400).json({ error: 'Fondos insuficientes en el proyecto' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al realizar la donación' })
  }
})

module.exports = router
