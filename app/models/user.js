// app/models/user.js

var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  favourites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Webpage'}],
  created_at: { type: Date, default: Date.now },
  updated_at: Date
})

userSchema.pre('save', function (next) {
  var currentDate = new Date()
  this.updated_at = currentDate
  next()
})

userSchema.methods.toJSON = function () {
  var obj = this.toObject()
  return obj
}

module.exports = mongoose.model('User', userSchema)
