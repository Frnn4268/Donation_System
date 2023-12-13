const express = require('express') // Importing modules
const router = express.Router()
const multer = require('multer')
const upload = multer()

const Project = require('../model/projectModel')
const Donation = require('../model/donationModel')
const verifyToken = require('../middlewares/verifyToken')

// GET route to retrieve all projects
router.get('/', verifyToken, async (req, res) => {
  const proyecto = await Project.findAll()
  res.status(200).json(proyecto)
})

// GET route to retrieve a specific project by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id
  const proyecto = await Project.findOne({
    where: {
      proyectoID: id
    }
  })
  res.status(200).json(proyecto)
})

// POST route to create a new project
router.post('/', verifyToken, async (req, res) => {
  const dataProyectos = req.body
  await Project.sync()
  const createProyecto = await Project.create({
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

// PUT route to update an existing project by ID
router.put('/:id', verifyToken, async (req, res) => {
  const dataProyectos = req.body
  const id = req.params.id
  const updateProyecto = await Project.update({
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

// DELETE route to delete a project by ID
router.delete('/:id', verifyToken, async (req, res) => {
  const id = req.params.id

  const donationVerify = await Donation.count({
    where: { ProyectoID: id }
  })

  if (donationVerify > 0) { // Verify if the project have donations
    return res.status(400).json({ error: 'The project can´t be deleted. It has associated donations' })
  }

  try {
    const deleteProyecto = await Project.destroy({
      where: {
        proyectoID: id
      }
    })
    res.status(200).json(deleteProyecto)
  } catch (error) {
    res.status(500).json({ error: 'Error while the project has been deleted' })
    console.error(error)
  }
})

// POST route to upload a file for a specific project
router.post('/:id/upload-file', verifyToken, upload.single('archivo'), async (req, res, next) => {
  const proyectoID = req.params.id
  const archivoData = req.file.buffer // Binary data of the file

  try {
    const proyecto = await Project.findByPk(proyectoID)

    if (!proyecto) {
      return res.status(404).json({ error: 'Project not found' })
    }

    proyecto.DocumentoSoporte = archivoData
    await proyecto.save()

    res.status(200).json({ message: 'File uploaded successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error loading file' })
  }
})

// GET route to view a specific supporting document for a project
router.get('/:id/see-documents', async (req, res) => {
  const proyectoID = req.params.id

  try {
    const proyecto = await Project.findByPk(proyectoID)

    if (!proyecto || !proyecto.DocumentoSoporte) {
      return res.status(204).send('No supporting files were found for the project.')
    }

    const documentoSoporte = proyecto.DocumentoSoporte
    res.setHeader('Content-Type', 'application/pdf') // Ajusta el tipo de contenido según el tipo de archivo.
    res.send(documentoSoporte)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error viewing support file' })
  }
})

module.exports = router
