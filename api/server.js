require('dotenv').config()
const app = require('./app')

// Define the port on which the server will run, using the environment variable or defaulting to 4010
const serverPort = process.env.BACKEND_PORT || 4010

app.listen(serverPort, () => {
  console.log(`Server running in port ${serverPort}`)
})
