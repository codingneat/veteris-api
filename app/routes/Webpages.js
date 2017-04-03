// app/routes/.js
'use strict'
const express	= require('express')
const router	= express.Router()
const _ = require('lodash')
const Webpage 	= require('../models/webpage')
const webpageService 	= require('../services/webpage')
const kue = require('kue')
const queue = kue.createQueue()
const sockets = require('../../config/initializers/sockets');

// Create 
router.post('/', function (req, res, next) {

  if(req.body.name !== "undefined"){

      var job = queue.create('addWebpage', {  
        name: req.body.name,
        user: req.decoded._id
      }).priority('high').attempts(5).save();


      job.on('complete', function(result){
        let webpage = webpageService.fillWebpage(result.webpage, result.user);

        webpage.save(function (err) {
          if (err) return next(err)

          _.forEach(req.io.sockets.connected, function(sock) {
            if(_.indexOf(sockets[result.user],sock.id)!==-1){
              sock.emit('savingWebpage', webpage._id);
            }
          })
        });              


      }).on('failed attempt', function(errorMessage, doneAttempts){
        console.log('Job failed');

      }).on('failed', function(errorMessage){
        console.log('Job failed');

      }).on('progress', function(progress, data){
        console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );

      });  

      return res.status(200).json("ok"); 

  }

  return res.status(200).json("no");




})

// Find One 
router.get('/findOne/:id', function (req, res, next) {
  console.log(req.params.id);

  Webpage.findOne({ '_id': req.params.id }).exec(function (err, webpage) {
    if (err) return next(err)

    return res.json(webpage)
  })
})


module.exports = router