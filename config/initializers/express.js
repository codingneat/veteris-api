// config/initializers/express.js
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
const methodOverride = require('method-override')

const start = function (app) {
  'use strict'


app.use(morgan('dev'))

	// Parse Application
  app.use(cookieParser())
  app.use(bodyParser.json())

  app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

  app.use(bodyParser.urlencoded({ extended: false }))

  // Override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
  app.use(methodOverride('X-HTTP-Method-Override'))

	app.use("/public", express.static(path.join(__dirname, '/../../public')))

	// Set CORS Headers and Other Stuffs
  app.all('*', function(req, res, next) {

     res.set('Access-Control-Allow-Origin', process.env.NODE_DEV_SITE)

    res.set('Access-Control-Allow-Credentials', true)
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT')
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type, x-access-token')
    if ('OPTIONS' === req.method) return res.send(200)
    next()
  })
}

module.exports = start
