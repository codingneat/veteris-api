// app/models/theme.js

var mongoose = require('mongoose')

var themeSchema = new mongoose.Schema({
  name: {type: String, required: true},
  created_at: { type: Date, default: Date.now },
  updated_at: Date
})

themeSchema.pre('save', function (next) {
  var currentDate = new Date()
  this.updated_at = currentDate
  next()
})

themeSchema.methods.toJSON = function () {
  var obj = this.toObject()
  return obj
}

module.exports = mongoose.model('Theme', themeSchema)
