// app/routes/.js
'use strict'
const express	= require('express')
const router	= express.Router()
const _ = require('lodash')
const Webpage 	= require('../models/webpage')
const kue = require('kue')
const queue = kue.createQueue()


// Create 
router.post('/', function (req, res, next) {

  console.log("begin");

  if(req.body.name !== "undefined"){

      var job = queue.create('addWebpage', {  
        name: req.body.name,
        user: req.decoded._id
      }).priority('high').attempts(5).save();


      job.on('complete', function(result){
        let webpage = new Webpage()

        let meta = {
            titles : [result.meta.title, result.extract.title, result.extract.softTitle],
            authors: [result.meta.author, result.extract.author],
            descriptions : [result.meta.description, result.extract.description],
            images : [result.meta.image, result.extract.image],
            tags : result.extract.tags,
            charset: result.meta.charset,
            canonicalLink: result.extract.canonicalLink,
            lang: result.extract.lang,
            publisher: result.extract.publisher,
            copyright: result.extract.copyright,
            url: {
              scheme: result.meta.scheme,
              tld: result.parseUrl.tld,
              domain: result.parseUrl.domain,
              subdomain: result.parseUrl.subdomain
            }
        }

        webpage.title = result.extract.title;
        webpage.author = result.extract.author;
        webpage.description = result.extract.description;
        webpage.image = result.extract.image; 
        webpage.url = result.meta.url;
        //webpage.user = req.decoded._id;
        webpage.meta = meta;

        webpage.save(function (err) {
          if (err) return next(err)

        })

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


module.exports = router