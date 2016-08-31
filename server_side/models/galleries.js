var mongoose = require('mongoose');
var Work = require("./works.js").schema;

var GallerySchema = mongoose.Schema({
	name: {type: String, required: true},
  	status: {type: Boolean},
	works: [Work]
});
module.exports = mongoose.model('Gallery', GallerySchema);