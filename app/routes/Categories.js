// app/routes/categories.js
'use strict'
const express	= require('express')
const router	= express.Router()
const _ = require('lodash')
const Category 	= require('../models/category')

// List Categories
router.get('/', function (req, res, next) {
  Category.find().select('_id name theme').populate('theme').sort({'_id': -1}).exec(function (err, categories) {
    if (err) return next(err)

    return res.status(200).json(categories)
  })
})

// Find One Category
router.get('/findOne/:id', function (req, res, next) {
  Category.findOne({ 'id': req.params.id }).exec(function (err, category) {
    if (err) return next(err)

    return res.json(category)
  })
})

// Create Category
router.post('/', function (req, res, next) {
  console.log(req.body);
  let category = Category(req.body)

  category.save(function (err) {
    if (err) return next(err)

    return res.json(category)
  })
})

// Edit Category
router.put('/:id', function (req, res, next) {
  let category = req.body
  delete category._id

  Category.findByIdAndUpdate(req.params.id, category, {new: true}, function (err, resp) {
    if (err) return next(err)

    return res.json(resp)
  })
})

// Delete Category
router.delete('/:id', function (req, res, next) {
  const categoryId = req.params.id

  Category.findByIdAndRemove(categoryId, function (err) {
    if (err) return next(err)

    res.send('ok')
  })
})

// Search Category
router.get('/search/:id', function (req, res, next) {
  const name = req.params.id
  const query = Category.find({"name": { "$regex": name, "$options": "i" }})

  query
  .exec(function (err, category) {
    if (err) return next(err)

    res.json(category)
  })
})

module.exports = router

