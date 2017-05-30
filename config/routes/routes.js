// config/routes/routes.js
'use strict'

var routes = require('require-all')(__dirname + '/../../app/routes')

var start = function (app, prefix) {
  app.use(prefix + '/heroes', routes.Heroes)
  app.use(prefix + '/users', routes.Users)
  app.use(prefix + '/themes', routes.Themes)
  app.use(prefix + '/categories', routes.Categories)
  app.use(prefix + '/tags', routes.Tags)
  app.use(prefix + '/webpages', routes.Webpages)
}

module.exports = start
