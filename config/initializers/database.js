// config/initializers/database.js
'use strict'

const mongoose = require('mongoose')
const winston  = require('winston')

const start = function (cb) {
  'use strict'

  // Initialize MongoDB
  mongoose.connect(process.env.NODE_DATABASE)

  require('winston-mongodb').MongoDB;
  winston.add(winston.transports.MongoDB, {db: process.env.NODE_DATABASE});


  cb()
}

module.exports = start
