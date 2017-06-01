// config/initializers/server.js
'use strict'

const express = require('express')
const path = require('path')
const routes = require('require-all')(path.join(__dirname, '/../../app/routes'))
const fs = require('fs');

const hskey = fs.readFileSync('./config/certs/privatekey.pem');
const hscert = fs.readFileSync('./config/certs/certificate.pem')


const start = function (cb) {
  const app = express()

  const options = {
      key: hskey,
      cert: hscert
  };

  const server = require('https').createServer(options, app)
  const io     = require('socket.io').listen(server)

  require('./express')(app)

  app.use(function(req, res, next) {
        req.io = io;
        next();
  });

  app.use("/public", express.static(__dirname + '/public'))

  app.use('/auth', routes.Auth)

  // AUTHenticate route
  require('../auth/auth')(app)

  // Go route
  require('../routes/routes')(app)

  require('../socketsBase')(io);




  // Error Handling
  app.use(function (err, req, res, next) {
    console.log(err)
    res.status(err.status || 500).json({message: 'Server error', error: err.message})
  })

  app.use("/public", express.static(__dirname + '/public'))

  // Initialize Server
  server.listen(process.env.NODE_PORT)

  console.log('Magic happens on port ' + process.env.NODE_PORT)
  console.log('env:  ' + process.env.NODE_ENV)

  if (cb) {
    return cb()
  }
}

module.exports = start
