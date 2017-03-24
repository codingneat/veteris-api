// app/routes/heros.js
'use strict'
const express	= require('express')
const router	= express.Router()
const _ = require('lodash')
const Hero 	= require('../models/hero')
var extractor = require('unfluff')
var MetaInspector = require('node-metainspector');
var webshot = require('webshot');
var parseDomain = require('parse-domain');
var scrape = require('website-scraper');
var request = require('request');
var textract = require('textract');

// List Heroes
router.get('/', function (req, res, next) {
  Hero.find().select('_id id name').sort({'_id': -1}).exec(function (err, heros) {
    if (err) return next(err)

    return res.status(200).json(heros)
  })
})

// Find One Hero
router.get('/findOne/:id', function (req, res, next) {
  Hero.findOne({ 'id': req.params.id }).exec(function (err, hero) {
    if (err) return next(err)

    return res.json(hero)
  })
})

// Create Hero
router.post('/', function (req, res, next) {
  let hero = Hero(req.body)

  hero.save(function (err) {
    if (err) return next(err)

    return res.json(hero)
  })
})

// Edit Hero
router.put('/:id', function (req, res, next) {
  let hero = req.body
  delete hero._id

  Hero.findByIdAndUpdate(req.params.id, hero, {new: true}, function (err, resp) {
    if (err) return next(err)

    return res.json(resp)
  })
})

// Delete Hero
router.delete('/:id', function (req, res, next) {
/*  const heroId = req.params.id

  Hero.findByIdAndRemove(heroId, function (err) {
    if (err) return next(err)

    res.send('ok')
  }) */

/*  var data = extractor("http://www.lemonde.fr/election-presidentielle-2017/article/2016/12/02/et-hollande-renonca-a-se-representer_5042285_4854003.html","fr");
 
  console.log(data); */

/*  var client = new MetaInspector("http://www.dzurico.com/angular-cli-with-the-super-powers/", { timeout: 5000 });

  client.on("fetch", function(){
      console.log(client);
      console.log("Description: " + client.description);

  });

  client.on("error", function(err){
      console.log(err);
  });

  client.fetch();  */

/*
  webshot('http://www.dzurico.com/angular-cli-with-the-super-powers/', 'dzurico.png', function(err) {
    // screenshot now saved to google.png
  });
  */
//console.log(parseDomain("https://netbasal.com/angular-cli-and-global-sass-variables-a1b92d8ca9b7#.y62hj17ur"));
/*	var options = {
  urls: ['http://www.dzurico.com/angular-cli-with-the-super-powers/'],
  directory: 'C:\Arise\august-api\content',
  };

  scrape(options).then(console.log).catch(console.log); */
/*
  request('http://www.dzurico.com/angular-cli-with-the-super-powers/', function (error, response, body) {
    var data = extractor(body,"en");
    console.log(data);
  }); */
textract.fromUrl("http://www.dzurico.com/angular-cli-with-the-super-powers/", function( error, text ) {
console.log(text);

})


})

// Search Hero
router.get('/search/:id', function (req, res, next) {
  const name = req.params.id
  const query = Hero.find({"name": { "$regex": name, "$options": "i" }})

  query
  .exec(function (err, hero) {
    if (err) return next(err)

    res.json(hero)
  })
})

module.exports = router
