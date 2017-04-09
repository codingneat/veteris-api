// app/routes/.js
'use strict'
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Webpage = require('../models/webpage')
const webpageService = require('../services/webpage')
const websiteService = require('../services/website')
const kue = require('kue')
const queue = kue.createQueue()
const sockets = require('../../config/initializers/sockets');

// Create 
router.post('/', function (req, res, next) {

  if (req.body.name !== "undefined") {
    var job = queue.create('addWebpage', {
      name: req.body.name,
      user: req.decoded._id
    }).priority('high').attempts(5).save();

    job.on('complete', function (result) {

      websiteService.checkWebsite(result.webpage, function (err, website){
        let webpage = webpageService.fillWebpage(result.webpage, result.user)
        
        website.save(function (err) {
          if(website != null)  webpage.website = website
          webpage.save(function (err) {
            if (err) return next(err)
            _.forEach(req.io.sockets.connected, function (sock) {
              if (_.indexOf(sockets[result.user], sock.id) !== -1) {
                sock.emit('savingWebpage', webpage._id);
              }
            })
          }); 
        });     
      })

        
      }).on('failed attempt', function (errorMessage, doneAttempts) {
    console.log('Job failed');

  }).on('failed', function (errorMessage) {
    console.log('Job failed');

  }).on('progress', function (progress, data) {
    console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data);

  });

  return res.status(200).json("ok"); 

  }

  return res.status(200).json("no");

})

// Find One 
router.get('/findOne/:id', function (req, res, next) {
  Webpage
    .findOne({ '_id': req.params.id })
    .populate({
      path: 'pertinence',
      match: { user: req.decoded_id },
      select: '_id'
    })
    .populate({
      path: 'grade',
      match: { user: req.decoded_id },
      select: '_id'
    })
    .populate({
      path: 'favourite',
      match: { user: req.decoded_id },
      select: '_id'
    })
    .populate('user', 'firstName lastName')
    .populate('website', 'url')
    .exec(function (err, webpage) {
      if (err) return next(err)

      return res.json(webpage)
    })
})

// Edit User
router.put('/:id', function (req, res, next) {
  let webpage = req.body
  delete webpage._id

  if (webpage.points)

    Webpage.findByIdAndUpdate(req.params.id, webpage, { new: true }, function (err, resp) {
      if (err) return next(err)

      return res.json(resp)
    })
})

router.put('/pertinence/:id', function (req, res, next) {
  Webpage.findOne({ '_id': req.params.id }).exec(function (err, webpage) {
    let points = webpage.pertinence.filter(per => {
      return per.user == req.decoded._id;
    })
    if (points.length == 0) {
      webpage.pertinence.push({ user: req.decoded._id, points: req.body.points })
    } else {
      let per = webpage.pertinence.id(points[0]._id);
      per.points = req.body.points;
    }
    webpage.save();
    return "ok"
  });
})

router.put('/grade/:id', function (req, res, next) {
  Webpage.findOne({ '_id': req.params.id }).exec(function (err, webpage) {
    let status = webpage.grade.filter(st => {
      return st.user == req.decoded._id;
    })
    if (status.length == 0) {
      webpage.grade.push({ user: req.decoded._id, status: req.body.grade })
    } else {
      let st = webpage.grade.id(status[0]._id);
      st.status = req.body.grade;
    }
    webpage.save();
    return "ok"
  });
})

router.put('/favourite/:id', function (req, res, next) {
  Webpage.findOne({ '_id': req.params.id }).exec(function (err, webpage) {
    let fav = webpage.favourite.filter(fv => {
      return fv.user == req.decoded._id;
    })
    if (fav.length == 0) {
      webpage.favourite.push({ user: req.decoded._id, fav: req.body.favourite })
    } else {
      let fv = webpage.favourite.id(fav[0]._id);
      fv.fav = req.body.favourite;
    }
    webpage.save();
    return "ok"
  });
})


module.exports = router