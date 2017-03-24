// app/routes/users.js
'use strict'
const express	= require('express')
const router	= express.Router()
const _ = require('lodash')
const jwt = require('jsonwebtoken')

const User 	= require('../models/user')


// List Users
router.get('/', function (req, res, next) {
  User.find().select('_id firstName lastName password email').sort({'_id': -1}).exec(function (err, users) {
    if (err) console.log(err);

    return res.status(200).json(users)
  })
})


// Login
router.post('/login', function (req, res, next) {
	if(req.body.email==="d@d.com"&&req.body.password==="ddd"){
		var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
		return res.json({id_token:'tre'})
	}else{
		return res.status(403).json('no')
	}

})

// Find One User
router.get('/findOne/:id', function (req, res, next) {
  User.findOne({ '_id': req.params.id }).exec(function (err, user) {
    if (err) return next(err)

    return res.json(user)
  })
})


// Create User
router.post('/', function (req, res, next) {
  console.log(req.body);
  let user = User(req.body)

  user.save(function (err) {
    if (err) return next(err)

    return res.json(user)
  })
})

// Edit User
router.put('/:id', function (req, res, next) {
  let user = req.body
  delete user._id

  User.findByIdAndUpdate(req.params.id, user, {new: true}, function (err, resp) {
    if (err) return next(err)

    return res.json(resp)
  })
})

// Delete User
router.delete('/:id', function (req, res, next) {
  const userId = req.params.id

  User.findByIdAndRemove(userId, function (err) {
    if (err) return next(err)

    res.send('ok')
  })
})

// Search User
router.get('/search/:id', function (req, res, next) {
  const name = req.params.id
  const query = User.find({"name": { "$regex": name, "$options": "i" }})

  query
  .exec(function (err, user) {
    if (err) return next(err)

    res.json(user)
  })
})




module.exports = router
