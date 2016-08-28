var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = mongoose.Schema({
	email: {type: String, unique: true},
  	password: String,
	join_date: Date,
	personal_bio: String,
	admin_user: Boolean,
	firstname: String,
	lastname: String
});
UserSchema.statics.hashPassword = function(password, cb){
    bcrypt.hash(password, null, null, cb);
};
UserSchema.methods.validatePassword = function(password, cb){
    bcrypt.compare(password, this.password, cb);
};
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);