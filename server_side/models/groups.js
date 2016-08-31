var mongoose = require('mongoose');
var User = require("./users.js").schema;
var Schema = mongoose.Schema;

var GroupSchema = mongoose.Schema({
	name: {type: String, required: true},
  	status: {type: Boolean},
  	created_on: {type: Date},
	created_by: [{type: Schema.Types.ObjectId,ref: 'User'}],
	active_users: [{type: Schema.Types.ObjectId,ref: 'User'}]
});
module.exports = mongoose.model('Group', GroupSchema);