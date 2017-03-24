// app/models/hero.js

var mongoose = require('mongoose')

var heroSchema = new mongoose.Schema({
  name: {type: String, required: true},
  id: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: Date
})

heroSchema.pre('save', function (next) {
  var currentDate = new Date()
  this.updated_at = currentDate
  next()
})

heroSchema.methods.toJSON = function () {
  var obj = this.toObject()
  return obj
}

module.exports = mongoose.model('Hero', heroSchema)
