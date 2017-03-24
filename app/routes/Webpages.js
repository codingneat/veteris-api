// app/routes/.js
'use strict'
const express	= require('express')
const router	= express.Router()
const _ = require('lodash')

var kue = require('kue');  
var queue = kue.createQueue();


// Create 
router.post('/', function (req, res, next) {
  console.log(req.body);
  var job = queue.create('payment', {  
    title: 'Welcome to the site',
    to: 'user@example.com',
    template: 'welcome-email'
  }).priority('high').attempts(5).save();
  
  job.on('complete', function(result){
  console.log('Job completed with data ', result);

}).on('failed attempt', function(errorMessage, doneAttempts){
  console.log('Job failed');

}).on('failed', function(errorMessage){
  console.log('Job failed');

}).on('progress', function(progress, data){
  console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );

});




})


module.exports = router