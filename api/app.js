const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const session = require('express-session')
const helmet = require('helmet')

const { testConnection } = require('./middlewares/databaseMiddleware')

require('dotenv').config()

const indexRouter = require('./routes/indexRouter')
const proyectosRouter = require('./routes/projectRouter')
const usuariosRouter = require('./routes/userRouter')
const loginRouter = require('./routes/authRouter')
const registerRouter = require('./routes/regRouter')
const donacionesRouter = require('./routes/donationRouter')

const app = express()
app.use(testConnection)

app.use(session({
  secret: process.env.TOKEN_KEY,
  resave: false,
  saveUninitialized: true
}))

const corsOptions = {
  origin: process.env.FRONTEND_DOMAIN, // Colocar dominio de Digital Ocean
  credentials: true
}

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-cdn.com'],
      styleSrc: ["'self'", 'fonts.googleapis.com'],
      // Agrega una directiva para bloquear las fuentes de scripts y estilos en línea
      scriptSrcElem: ["'self'"], // permitir scripts en línea del mismo origen
      scriptSrcAttr: ["'none'"], // no permitir atributos 'src' de elementos de script
      styleSrcElem: ["'self'"], // permitir estilos en línea del mismo origen
      styleSrcAttr: ["'none'"] // no permitir atributos 'src' de elementos de estilo
    }
  })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middlewares.
app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet())

// Routes
app.use('/', indexRouter)
app.use('/api/v1/proyectos', proyectosRouter)
app.use('/api/v1/usuarios', usuariosRouter)
app.use('/api/v1', loginRouter)
app.use('/api/v1/register', registerRouter)
app.use('/api/v1/donaciones', donacionesRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
