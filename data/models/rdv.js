var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var RdvSchema = new Schema({
    login: String
  , etat: { type: Number, default: 0 }
  , completed: { type: Boolean, default: false }
  , date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Rdv', RdvSchema)