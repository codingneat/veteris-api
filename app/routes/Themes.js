// app/routes/themes.js
'use strict'
const express	= require('express')
const router	= express.Router()
const _ = require('lodash')
const Theme 	= require('../models/theme')

// List Themes
router.get('/', function (req, res, next) {
  Theme.find().select('_id id name').sort({'_id': -1}).exec(function (err, themes) {
    if (err) return next(err)

    return res.status(200).json(themes)
  })
})

// Find One Theme
router.get('/findOne/:id', function (req, res, next) {
  Theme.findOne({ 'id': req.params.id }).exec(function (err, theme) {
    if (err) return next(err)

    return res.json(theme)
  })
})

// Create Theme
router.post('/', function (req, res, next) {
  let theme = Theme(req.body)

  theme.save(function (err) {
    if (err) return next(err)

    return res.json(theme)
  })
})

// Edit Theme
router.put('/:id', function (req, res, next) {
  let theme = req.body
  delete theme._id

  Theme.findByIdAndUpdate(req.params.id, theme, {new: true}, function (err, resp) {
    if (err) return next(err)

    return res.json(resp)
  })
})

// Delete Theme
router.delete('/:id', function (req, res, next) {
  const themeId = req.params.id

  Theme.findByIdAndRemove(themeId, function (err) {
    if (err) return next(err)

    res.send('ok')
  })
})

// Search Theme
router.get('/search/:id', function (req, res, next) {
  const name = req.params.id
  const query = Theme.find({"name": { "$regex": name, "$options": "i" }})

  query
  .exec(function (err, theme) {
    if (err) return next(err)

    res.json(theme)
  })
})

module.exports = router
