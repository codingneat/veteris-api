// app/routes/tags.js
'use strict'
const express	= require('express')
const router	= express.Router()
const _ = require('lodash')
const Tag 	= require('../models/tag')
var sockets = require('../../config/initializers/sockets')

// List Tags
router.get('/', function (req, res, next) { 
  Tag.find().select('_id id name').sort({'_id': -1}).exec(function (err, tags) {
    if (err) return next(err)

    return res.status(200).json(tags)
  })
})

// Find One Tag
router.get('/findOne/:id', function (req, res, next) {
  Tag.findOne({ 'id': req.params.id }).exec(function (err, tag) {
    if (err) return next(err)

    return res.json(tag)
  })
})

// Create Tag
router.post('/', function (req, res, next) {
  let tag = Tag(req.body)

  tag.save(function (err) {
    if (err) return next(err)

    return res.json(tag)
  })
})

// Edit Tag
router.put('/:id', function (req, res, next) {
  let tag = req.body
  delete tag._id

  var io = req.io;

  _.forEach(io.sockets.connected, function(sock) {
    if(_.indexOf(sockets[req.decoded._id],sock.id)!==-1){
      sock.emit('newTweet', 'test');
    }
  });    

  Tag.findByIdAndUpdate(req.params.id, tag, {new: true}, function (err, resp) {
    if (err) return next(err)

    return res.json(resp)
  })
})

// Delete Tag
router.delete('/:id', function (req, res, next) {
  const tagId = req.params.id

  Tag.findByIdAndRemove(tagId, function (err) {
    if (err) return next(err)

    res.send('ok')
  })
})

// Search Tag
router.get('/search/:id', function (req, res, next) {
  const name = req.params.id
  const query = Tag.find({"name": { "$regex": name, "$options": "i" }})

  query
  .exec(function (err, tag) {
    if (err) return next(err)

    res.json(tag)
  })
})

module.exports = router