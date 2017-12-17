require('dotenv').config()
var app = require('./app')
var port = process.env.PORT || 3000

app.listen(port, process.env.HOST, function () {
  console.log(`listening on: ${port} HOST:NODE_ENV: ${process.env.HOST}:${process.env.NODE_ENV}`)
})
