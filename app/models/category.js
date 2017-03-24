// app/models/category.js

var mongoose = require('mongoose')

var categorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  theme: {type: mongoose.Schema.Types.ObjectId, ref: 'Theme'},
  created_at: { type: Date, default: Date.now },
  updated_at: Date
})

categorySchema.pre('save', function (next) {
  var currentDate = new Date()
  this.updated_at = currentDate
  next()
})

categorySchema.methods.toJSON = function () {
  var obj = this.toObject()
  return obj
}

module.exports = mongoose.model('Category', categorySchema)
