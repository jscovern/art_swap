var mongoose = require('mongoose');
var WorkSchema = mongoose.Schema({
	name: {type: String, required: true},
  	description: {type: String, required: true},
  	month: {type: String, required: true},
  	year: {type: String, required: true},
  	approximate_value: {type: Number, required: true},
  	img_url: {type: String},
  	added_on: {type: Date},
  	swappable: {type: Boolean}
});
module.exports = mongoose.model('Work', WorkSchema);