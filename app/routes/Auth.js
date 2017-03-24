'use strict'

const express	= require('express')
const router	= express.Router()
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const config  = require('../../config/config')
const mylog = require('../services/mylog')
const User  = require('../models/user')

// Login
router.post('/login', function (req, res, next) {

	console.log(req.body.email);

    // find the user
	User.findOne({
	email: req.body.email
	}, function(err, user) {
		if (err) throw err;

		if (!user||user.estado===0) {
			mylog('Fallo de autentificación, usuario no encontrado','Autentificación',0,req.body.email);
			res.json({ success: false, message: 'Falló la autenticación. Las credenciales no corresponden.' });
		}else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				mylog('Fallo de autentificación, password no corresponde','Autentificación',0,req.body.email);
				res.json({ success: false, message: 'Falló la autenticación. Las credenciales no corresponden.' });
			}else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user.toObject(), config.secret, {
					expiresIn: 1440 // expires in 24 hours
				});


				mylog('Autentificación','Autentificación',0,user.name+' '+user.lastname);
				// return the information including token as JSON
				res.json({
					success: true,
					user: user,
					id_token: token
				});
			}   

        }
	});


      

})



module.exports = router
