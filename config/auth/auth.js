// config/auth/auth.js
'use strict'

const jwt = require('jsonwebtoken')
const config = require('../../config/config')

const start = function (app) {
  app.use(function (req, res, next) {
    const token = req.headers['authorization'] ? req.headers['authorization'].slice(7) : ""

    if (token) {
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
           console.log(err);
          return res.status(403).send({
            success: false,
            message: 'No valid token.'
          })
        }
        req.decoded = decoded
        next()
      })
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      })
    }
  })
}

module.exports = start
