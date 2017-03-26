// app/models/webpage.js

var mongoose = require('mongoose')

var webpageSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String},
  date: Date,
  description: {type: String},
  image: {type: String},
  url: {type: String},
  theme: {type: mongoose.Schema.Types.ObjectId, ref: 'Theme'},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tags: [String],
  isUp : { type: Boolean, default: true },
  type: { type: String, required: true, enums: ['Article','Repository','Tutorial','Video'], default: 'Article'},
  status: {type: String, required: true, enum: ['Active', 'ToDefine', 'Outdated', 'Deprecated'], default: 'Active'},
  created_at: { type: Date, default: Date.now },
  updated_at: Date,
  meta: {
      titles : [String],
      authors: [String],
      descriptions : [String],
      images : [String],
      tags : [String],
      charset: {type: String},
      canonicalLink: {type: String},
      lang: {type: String},
      publisher: {type: String},
      copyright: {type: String},
      url: {
        scheme: {type: String},
        tld: {type: String},
        domain: {type: String},
        subdomain: {type: String}
      }
  },
})

webpageSchema.pre('save', function (next) {
  var currentDate = new Date()
  this.updated_at = currentDate
  next()
})

webpageSchema.methods.toJSON = function () {
  var obj = this.toObject()
  return obj
}

module.exports = mongoose.model('Webpage', webpageSchema)
