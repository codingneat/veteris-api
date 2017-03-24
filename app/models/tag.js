// app/models/tag.js

var mongoose = require('mongoose')

var tagSchema = new mongoose.Schema({
  name: {type: String, required: true},
  created_at: { type: Date, default: Date.now },
  updated_at: Date
})

tagSchema.pre('save', function (next) {
  var currentDate = new Date()
  this.updated_at = currentDate
  next()
})

tagSchema.methods.toJSON = function () {
  var obj = this.toObject()
  return obj
}

module.exports = mongoose.model('Tag', tagSchema)
