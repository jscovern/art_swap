var mongoose = require('mongoose');
var User = require("./users.js").schema;
var GallerySchema = mongoose.Schema({
	name: {type: String, required: true},
  	status: {type: Boolean},
  	user: [User]
});
module.exports = mongoose.model('Gallery', GallerySchema);