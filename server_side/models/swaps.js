var mongoose = require('mongoose');
var User = require("./users.js").schema;
var Work = require("./works.js").schema;
var Schema = mongoose.Schema;

var SwapSchema = mongoose.Schema({
	liked_by_user: {type: Schema.Types.ObjectId,ref: 'User'},
	created_by_user: {type: Schema.Types.ObjectId,ref: 'User'},
	liked_by_work: {type:Schema.Types.ObjectId,ref: 'Work'},
	created_by_works: [{type:Schema.Types.ObjectId,ref: 'Work'}]
},
	{timestamps: true}
);
module.exports = mongoose.model('Swap', SwapSchema);