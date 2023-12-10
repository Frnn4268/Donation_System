const corsOptions = {
  origin: process.env.FRONTEND_DOMAIN, // Colocar dominio de Digital Ocean
  credentials: true
}

module.exports.corsOptions = corsOptions
