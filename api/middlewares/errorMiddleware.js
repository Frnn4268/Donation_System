// errorMiddleware.js
function errorMiddleware (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)

  // Render an error page or send a JSON response based on the request content type
  if (req.accepts('html')) {
    res.render('error') // Assuming you have an 'error' view set up
  } else if (req.accepts('json')) {
    res.json({ error: err.message })
  } else {
    res.type('txt').send(err.message)
  }
}

module.exports = errorMiddleware
