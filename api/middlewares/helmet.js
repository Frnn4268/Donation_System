const helmet = require('helmet')
const app = require('./app')

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
