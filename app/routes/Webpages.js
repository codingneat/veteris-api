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
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: { 'firstName': 1, 'lastName': 1},
        model: 'User'
      }
    })
    .exec(function (err, webpage) {
      if (err) return next(err)

      return res.json(webpage)
    })
})

// Edit Webpage
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
    return res.json("ok")
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
    webpage.save()
    return res.json("ok")
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
    webpage.save()
    return res.json("ok")
  });
})

router.post('/addcomment/:id', function (req, res, next) {
  Webpage.findOne({ '_id': req.params.id }).exec(function (err, webpage) {
    webpage.comments.push({ user: req.decoded._id, text: req.body.comment })

    webpage.populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: { 'firstName': 1, 'lastName': 1},
        model: 'User'
      }
    }).save()

    let comm = webpage.comments.filter(fv => {
      return fv.text == req.body.comment ;
    })

    let resp = comm[0].toObject();
    resp.user = {firstName:req.decoded.firstName, lastName:req.decoded.lastName,_id:req.decoded._id}

    return res.json(resp)
  });
})

router.post('/addtag/:id', function (req, res, next) {
  Webpage.findOne({ '_id': req.params.id }).exec(function (err, webpage) {
    if(webpage.tags.indexOf(req.body.tag) == -1)
    {
      webpage.tags.push(req.body.tag)
      webpage.save()
      return res.json(1)
    }else{
      return res.json(0)
    }
  });
})

router.get('/last', function (req, res, next) {
  Webpage
    .find()
    .limit(12)
    .exec(function (err, webpages) {
      if (err) return next(err)

      return res.json(webpages)
    })
})

router.post('/search', function (req, res, next) {
  let query = {};
  if(req.body.hasTheme) query.theme = req.body.theme;
  if(req.body.hasCategory) query.category = req.body.category;

  if(req.body.hasGrade) query.grade = {$elemMatch: {status: req.body.grade, user: req.decoded._id}};
  if(req.body.hasPoints) query.pertinence = {$elemMatch: { points: req.body.points, user: req.decoded._id}};

  if(req.body.hasTitle) query.title = { "$regex": req.body.title, "$options": "i" } ;
  if(req.body.hasAuthor) query.author = { "$regex": req.body.author, "$options": "i" } ;

  if(req.body.hasIsUp && req.body.isUp == "True") query.isUp = true;
  if(req.body.hasFavourite && req.body.favourite == "True") query.favourite = true;

  if(req.body.tags.length > 0 )query.tags = { $in: req.body.tags };

  console.log(query)
  console.log(req.body)

  Webpage.find(query).exec(function (err, webpages) {
    if (err) return next(err)

    return res.json(webpages)
  }); 
})


module.exports = router