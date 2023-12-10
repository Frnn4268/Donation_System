const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// Middlewares
const corsOptions = require('./middlewares/corsOptions.js')
const notFound = require('./middlewares/notFound.js')
const handleError = require('./middlewares/handleError.js')

const indexRouter = require('./routes/indexRouter.js')
const proyectRouter = require('./routes/proyectRouter.js')
const userRouter = require('./routes/userRouter.js')
const authRouter = require('./routes/authRouter.js')
const regRouter = require('./routes/regRouter.js')
const donationRouter = require('./routes/donationRouter.js')

require('dotenv').config()

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middlewares
app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

// Routes
app.use('/', indexRouter)
app.use('/api/v1/proyect', proyectRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/login', authRouter)
app.use('/api/v1/register', regRouter)
app.use('/api/v1/donation', donationRouter)

app.use(notFound)
app.use(handleError)

module.exports = app
