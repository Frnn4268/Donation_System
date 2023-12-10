const app = require('./app')

const serverPort = process.env.PORT

app.listen(serverPort, () => {
  try {
    console.log(`Server running in port ${serverPort}`)
  } catch (err) {
    console.error(err)
  }
})
