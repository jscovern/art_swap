var mongoose = require('mongoose');
var User = require("./users.js").schema;
var Work = require("./works.js").schema;
var Schema = mongoose.Schema;

var SwapSchema = mongoose.Schema({
	created_by_work: [{type: Schema.Types.ObjectId, ref: "Work"}],
	second_swapper_work: [{type: Schema.Types.ObjectId, ref: "Work"}],
  	approved: {type: Boolean},
  	acted_on: {type: Boolean},
  	submission_comments: {type: Boolean},
  	approval_comments: {type: Boolean},
	created_by: [{type: Schema.Types.ObjectId,ref: 'User'}],
	second_swapper: [{type: Schema.Types.ObjectId,ref: 'User'}],
},
	{timestamps: true}
);
module.exports = mongoose.model('Swap', SwapSchema);