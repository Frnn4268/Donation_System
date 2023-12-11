require('dotenv').config()
const app = require('./app')

const serverPort = process.env.BACKEND_PORT || 4010

app.listen(serverPort, () => {
  console.log(`Server running in port ${serverPort}`)
})
