var Gallery = require('../models/galleries');
var Work = require('../models/works');
var User = require('../models/users');
var app = require('../../server.js');


function createSwap(req,res) {
	// var gallery = new Gallery(req.body);
	// gallery.save(function(err) {
	// 	if(err) {
	// 		console.log('error saving new gallery: '+err);
	// 		return res.json({url: '/#/profile/'+req.user._id,message: 'Error saving gallery: '+err, error: true});
	// 	}else {
	// 		console.log('new gallery save successful');
	// 		User.findById({_id: req.user._id}, function(error,user) { //have to add the gallery to a user after successful gallery save
	// 			if(error) {
	// 				return res.json({message: "Couldn't find the user b/c "+error});
	// 			}
	// 			user.galleries.push(gallery);
	// 			user.save(function(err) {
	// 				if(err) {
	// 					console.log('error saving gallery to user: '+err);
	// 					return res.json({url: '/#/profile/'+req.user._id,message: 'Error saving user: '+err, error: true});
	// 				} else {
	// 					console.log('gallery saved to user successfully');
	// 					return res.json({url: '/#/profile/'+req.user._id,message: "Gallery saved to user successfully", error: false});
	// 				}
	// 			});
	// 		});

	// 		// return res.json({url: '/#/profile/'+req.user._id,message: 'Gallery saved successfully, add some work into it!', error: false});
	// 	}
	// });
}

function getSwaps(req,res) {
	// Gallery.findById({_id: req.params.id}, function(error,gallery) {
	// 	if(error) {
	// 		return res.json({message: "couldn't find the gallery b/c "+error});
	// 	} else {
	// 		return res.json(gallery);
	// 	}

	// });
}


module.exports = {
createSwap: createSwap,
getSwaps: getSwaps
};