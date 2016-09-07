var Gallery = require('../models/galleries');
var Work = require('../models/works');
var User = require('../models/users');
var Swap = require('../models/swaps');
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
									checkForSwaps(req.body.user_id,work.created_by,work);
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

function checkForSwaps(likedBy_id,createdBy_id,newlyLikedWork) { //likedBy_id is the user id of the person that clicked like, createdBy_id is the user id of the person that created the work
	User.findById({_id: createdBy_id}).populate('liked_works').exec(function(error,createdBy) {
		if(error) {
			console.log('error finding createdBy: '+error);
			return;
		} else {
			console.log('found the createdBy user successfully');
			console.log(createdBy);
			var myWorksPrevLiked = createdBy.liked_works.filter(function(liked_work){
				if(liked_work.created_by == likedBy_id) {
					return liked_work;
				}
			});
			console.log(myWorksPrevLiked);
			if(myWorksPrevLiked.length > 0) {
				var newSwap = {
					liked_by_user: likedBy_id,
					created_by_user: createdBy_id,
					liked_by_work: newlyLikedWork,
					created_by_works: myWorksPrevLiked
				};
				var swap = new Swap(newSwap);
				swap.save(function(err) {
					if(err){
						console.log('error saving new swap '+err);
						// return res.json(err);
					}else {
						console.log('swap saved successfully');
						// return res.json(swap);
					}
				});
			}
		}
	});
}
function getMySwaps(req,res) {
	Swap.find({liked_by_user: req.params.id})
		.populate('liked_by_user').populate('created_by_user').populate('liked_by_work').populate('created_by_works')
		.exec(function(error,likedBySwaps) {
			if(error) {
				console.log('error finding likedBySwaps: '+error);
				return res.json(error);
			}else {
				Swap.find({created_by_user: req.params.id})
					.populate('liked_by_user').populate('created_by_user').populate('liked_by_work').populate('created_by_works')
					.exec(function(error,createdBySwaps) {
						if(error) {
							console.log('error finding createdBySwaps: '+error);
							return res.json(error);
						}else {
							return res.json({likedBySwaps: likedBySwaps, createdBySwaps: createdBySwaps});
						}
					});
			}
		});
}
module.exports = {
likeThisWork: likeThisWork,
getMySwaps: getMySwaps
};