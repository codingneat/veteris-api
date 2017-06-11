'use strict'

const express = require('express')
const router = express.Router()
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')
const mylog = require('../services/mylog')
const User = require('../models/user')

// Login
router.post('/login', function (req, res, next) {

	User.findOne({
		email: req.body.email
	}, function (err, user) {
		if (err) throw err;

		if (!user || user.estado === 0) {
			mylog('Fallo de autentificación, usuario no encontrado', 'Autentificación', 0, req.body.email);
			res.status(403).send({ success: false, message: 'Falló la autenticación. Las credenciales no corresponden.' });
		} else if (user) {

			if (user.password != req.body.password) {
				mylog('Fallo de autentificación, password no corresponde', 'Autentificación', 0, req.body.email);
				res.status(403).send({ success: false, message: 'Falló la autenticación. Las credenciales no corresponden.' });
			} else {

				const token = jwt.sign(user.toObject(), config.secret, {
					expiresIn: "24h"
				});

				mylog('Autentificación', 'Autentificación', 0, user.name + ' ' + user.lastname);
				res.json({
					success: true,
					user: user,
					id_token: token
				});
			}
		}
	});
})

router.post('/token', function (req, res, next) {
	const token = req.body.token;

	if (token) {
		jwt.verify(token, config.secret, function (err, decoded) {
			if (err) {
				return res.status(403).send({
					success: false,
					message: 'No valid token.'
				})
			}

			User.findOne({
				email: decoded.email
			}, function (err, user) {

				const newToken = jwt.sign(user, config.secret, {
					expiresIn: "24h"
				});

				mylog('Autentificación', 'Autentificación', 0, user.name + ' ' + user.lastname);
				res.json({
					success: true,
					user: user,
					id_token: token
				});
			});
		})
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		})
	}

})



module.exports = router
