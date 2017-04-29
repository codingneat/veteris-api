// config/auth/auth.js
'use strict'

const jwt = require('jsonwebtoken')
const config  = require('../../config/config')

const start = function (app) {
    app.use(function(req, res, next) {
          // Retreive Token
          const token =  req.headers['authorization'] ? req.headers['authorization'].slice(7) : ""

          if (token) {

            // Verify Token
            jwt.verify(token, config.secret, function(err, decoded) {
              if (err) next(err)
                // Retreive user and put in request object
                req.decoded = decoded
                next()
            })
          }else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            })
          }
    })
}

module.exports = start
