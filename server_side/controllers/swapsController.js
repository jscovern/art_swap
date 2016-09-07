var Gallery = require('../models/galleries');
var Work = require('../models/works');
var User = require('../models/users');
var app = require('../../server.js');

function likeThisWork(req,res) {
	Work.findById({_id: req.params.id}, function(error,work) {
		if(error) {
			console.log('error finding the work: '+error);
			return res.json(error);
		} else {
			work.liked_by.push(req.body.user_id);
			work.save(function(err) {
				if(err) {
					console.log('error adding a like to this work: '+err);
					return res.json(err);
				} else {
					console.log('user successfully pushed into liked_by on work');
					// return res.json(work);
					User.findById({_id: req.body.user_id}, function(error,user) {
						if(error) {
							console.log('error finding the user: '+error);
							return res.json(error);
						} else {
							user.liked_works.push(work);
							user.save(function(err) {
								if(err) {
									console.log('error saving user: '+err);
									return res.json(err);
								} else {
									console.log('work successfully added to users liked_works');
									checkForSwaps(req.body.user_id,work.created_by);
									return res.json({work: work, user: user});
								}
							});
						}
					});
				}
			});
		}
	});
}

function checkForSwaps(likedBy_id,createdBy_id) { //likedBy_id is the user id of the person that clicked like, createdBy_id is the user id of the person that created the work
	User.findById({_id: likedBy_id}, function(error,likedBy) {
		if(error) {
			console.log('error finding likedby: '+error);
			return;
		} else {
			console.log('foudn the likedby user successfully');
			console.log(likedBy);
			//if the likedBy.liked_works.created_by === createdBy_id from the parameter above
			//then that means that at least one swap should exist.  Then need to do the reverse
			//and find the createdBy User, and check his liked_works, and see if any of the
			//created_by on those, is the likedBy user.  If so, then we basically loop through
			//both arrays, and make all combinations.  Check if those combinations exist already
			//in the DB, and if they don't, post them.
			return;
		}
	});
}
module.exports = {
likeThisWork: likeThisWork
};