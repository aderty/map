var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
    login: String
  , nom: String
  , prenom: String
  , email: String
  , rappelRdv: { type: Boolean, default: true }
  , dateCreation: { type: Date, default: Date.now }
  , dateUpdate: { type: Date, default: Date.now }
});


module.exports = mongoose.model('UserModel', UserSchema)