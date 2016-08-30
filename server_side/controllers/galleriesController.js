var Gallery = require('../models/galleries');
var app = require('../../server.js');

function createGallery(req,res) {
	console.log('in the createGallery');
	console.log(req.body);
}

module.exports = {
createGallery: createGallery,
};