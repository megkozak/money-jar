let mongoose = require('mongoose')

const goalsSchema = mongoose.Schema({
  title:  String,
  body:   String,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Goals', goalsSchema)
