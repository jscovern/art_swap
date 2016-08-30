var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = mongoose.Schema({
	email: {type: String, unique: true, required: true},
  	password: {type: String, required: true},
	join_date: Date,
	personal_bio: {type: String, required: true},
	admin_user: Boolean,
	firstname: {type: String, required: true},
	lastname: {type: String, required: true},
	img_url: {type: String, required: false}
});
UserSchema.statics.hashPassword = function(password, cb){
    bcrypt.hash(password, null, null, cb);
};
UserSchema.methods.validatePassword = function(password, cb){
    bcrypt.compare(password, this.password, cb);
};
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);