// app/models/website.js

var mongoose = require('mongoose')

var websiteSchema = new mongoose.Schema({
  title: {type: String},
  image: {type: String},
  url: {type: String},
  theme: {type: mongoose.Schema.Types.ObjectId, ref: 'Theme'},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  isUp : { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: Date
})

websiteSchema.pre('save', function (next) {
  var currentDate = new Date()
  this.updated_at = currentDate
  next()
})

websiteSchema.methods.toJSON = function () {
  var obj = this.toObject()
  return obj
}

module.exports = mongoose.model('Website', websiteSchema)
