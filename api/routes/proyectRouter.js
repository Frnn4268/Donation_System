const express = require('express')
const router = express.Router()
const sql = require('mssql')
const multer = require('multer')
const { config } = require('../config/sqlServer')

const Proyects = require('../model/proyectModel')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', verifyToken, async (req, res) => {
  const proyecto = await Proyects.findAll()
  res.status(200).json(proyecto)
})

router.get('/:id', verifyToken, async (req, res) => {
  const id = req.params.id
  const proyecto = await Proyects.findOne({
    where: {
      proyectoID: id
    }
  })
  res.status(200).json(proyecto)
})

router.post('/', verifyToken, async (req, res) => {
  const dataProyectos = req.body
  await Proyects.sync()
  const createProyecto = await Proyects.create({
    NombreProyecto: dataProyectos.NombreProyecto,
    DescripcionProyecto: dataProyectos.DescripcionProyecto,
    EmpleadoID: dataProyectos.EmpleadoID,
    NombreEmpleado: dataProyectos.NombreEmpleado,
    ApellidoEmpleado: dataProyectos.ApellidoEmpleado,
    MetaTotal: dataProyectos.MetaTotal,
    EstadoProyecto: dataProyectos.EstadoProyecto
  })
  res.status(201).json(createProyecto)
})

router.put('/:id', verifyToken, async (req, res) => {
  const dataProyectos = req.body
  const id = req.params.id
  const updateProyecto = await Proyects.update({
    NombreProyecto: dataProyectos.NombreProyecto,
    DescripcionProyecto: dataProyectos.DescripcionProyecto,
    EmpleadoID: dataProyectos.EmpleadoID,
    NombreEmpleado: dataProyectos.NombreEmpleado,
    ApellidoEmpleado: dataProyectos.ApellidoEmpleado,
    MetaTotal: dataProyectos.MetaTotal,
    EstadoProyecto: dataProyectos.EstadoProyecto
  }, {
    where: {
      proyectoID: id
    }
  })
  res.status(200).json(updateProyecto)
})

router.delete('/:id', verifyToken, async (req, res) => {
  const id = req.params.id
  const deleteProyecto = await Proyects.destroy({
    where: {
      proyectoID: id
    }
  })
  res.status(200).json(deleteProyecto)
})

const storage = multer.memoryStorage() // Almacenar el archivo en memoria
const upload = multer({ storage })

router.post('/:id/cargar-archivo', upload.single('archivo'), async (req, res, next) => {
  const proyectoID = req.params.id
  const archivoData = req.file.buffer // Datos binarios del archivo

  try {
    const connection = await sql.connect(config)
    const result = await connection
      .request()
      .input('ProyectoID', sql.Int, proyectoID)
      .input('DocumentoSoporte', sql.VarBinary(sql.MAX), archivoData)
      .query('UPDATE Proyectos SET DocumentoSoporte = @DocumentoSoporte WHERE ProyectoID = @ProyectoID')
    res.status(200)
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.send(err)
  }
})

router.get('/:id/documentos-soporte', async (req, res) => {
  const proyectoID = req.params.id

  try {
    const connection = await sql.connect(config)
    const result = await connection
      .request()
      .input('ProyectoID', sql.Int, proyectoID)
      .query('SELECT DocumentoSoporte FROM Proyectos WHERE ProyectoID = @ProyectoID AND DocumentoSoporte IS NOT NULL')

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset)
    } else {
      res.status(204).send('No se encontraron archivos de soporte para el proyecto.')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
})

router.get('/:id/ver-archivo', async (req, res) => {
  const proyectoID = req.params.id

  try {
    const connection = await sql.connect(config)
    const result = await connection
      .request()
      .input('ProyectoID', sql.Int, proyectoID)
      .query('SELECT DocumentoSoporte FROM Proyectos WHERE ProyectoID = @ProyectoID AND DocumentoSoporte IS NOT NULL')

    if (result.recordset.length > 0) {
      const documentoSoporte = result.recordset[0].DocumentoSoporte
      res.setHeader('Content-Type', 'application/pdf') // Puedes ajustar el tipo de contenido según el tipo de archivo.
      res.send(documentoSoporte)
    } else {
      res.status(204).send('No se encontraron archivos de soporte para el proyecto.')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
})

module.exports = router
