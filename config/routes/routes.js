// config/routes/routes.js
'use strict'

var routes = require('require-all')(__dirname + '/../../app/routes')

var start = function (app) {
  app.use('/heroes', routes.Heroes)
  app.use('/users', routes.Users)
  app.use('/themes', routes.Themes)
  app.use('/categories', routes.Categories)
  app.use('/tags', routes.Tags)
  app.use('/webpages', routes.Webpages)
}

module.exports = start
