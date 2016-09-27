var Gallery = require('../models/galleries');
var Work = require('../models/works');
var User = require('../models/users');
var Swap = require('../models/swaps');
var app = require('../../server.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
	console.log('in the checkForSwaps');
	var res2;
	User.findById({_id: createdBy_id}).populate('liked_works').exec(function(error,createdBy){
			if(error) {
				return res2.json({error: error});
			}
			var myWorksPrevLiked = createdBy.liked_works.filter(function(liked_work){
				if(liked_work.created_by == likedBy_id) {
					return liked_work;
				}
			});
			var newSwap={};
			var swap;
			Promise.all(myWorksPrevLiked.map(function(work) {
				console.log('work is: ');
				console.log(work);
				Swap.find({liked_by_work: newlyLikedWork._id, created_by_work: work._id}, function(error,swapFound) {
					console.log('in the swap.find');
					console.log(swapFound);
					if(error) {
						return res2.json(error);
					}
					if(swapFound.length === 0) {
						console.log('in the if');
						newSwap = {
							liked_by_user: likedBy_id,
							created_by_user: createdBy_id,
							liked_by_work: newlyLikedWork,
							created_by_work: work
						};
						swap = new Swap(newSwap);
						console.log('swap is: ');
						console.log(swap);
						return swap.save();
					}
				});
			}))
			.then(function(swaps) {
				console.log(swaps);
			})
			.catch(function(err) {
				console.log('error is: '+err);
			});
		});
}
function getMySwaps(req,res) {
	var curr_user = new mongoose.Types.ObjectId(req.params.id); //have to cast the current user as an objectid so the match below works
	Swap.aggregate([
		{ $project: {liked_by_user: 1, created_by_user: 1, liked_by_work: 1, created_by_work: 1}}, //brings these fields through
		{ $match: { $or: 
			[
				{'liked_by_user': curr_user},
				{'created_by_user': curr_user}
			]
		}},
		// { $group: {_id: {liked_by_user:"$liked_by_user",created_by_user:"$created_by_user"}, liked_by_work: {"$addToSet": "$liked_by_work"}, created_by_work: {"$addToSet": "$created_by_work"} }} //addtoset adds in the unique values as an array, aggregating on the two user fields as the 'keys' of the aggregation
		{ $group: {_id: {liked_by_user:"$liked_by_user",created_by_user:"$created_by_user",liked_by_work:"$liked_by_work"}, created_by_work: {"$addToSet": "$created_by_work"} }} //addtoset adds in the unique values as an array, aggregating on the two user fields as the 'keys' of the aggregation
		])
	.exec(function(err,likedBySwaps) {
		if(err) {
			console.log('error aggregating likedBySwaps: '+err);
			return res.json(err);
		}else {
			Swap.populate(likedBySwaps,[
				{path: '_id.liked_by_user', model: 'User'},
				{path: '_id.created_by_user', model: 'User'},
				{path: 'liked_by_work', model: 'Work'},
				{path: 'created_by_work', model: 'Work'}
				], 
				function(err,likedBySwapsPop) {
					if(err) {
						console.log('error populating likedBySwaps: '+err);
						return res.json(err);
					}else {
						console.log('curr_user is: '+curr_user);
						console.log('likedBySwapsPop is: ');
						console.log(likedBySwapsPop);
						var liked_by = likedBySwapsPop.filter(function(item, pos) {return item._id.liked_by_user._id.toString() == curr_user.toString();});
						var created_by = likedBySwapsPop.filter(function(item,pos) {return item._id.created_by_user._id.toString() === curr_user.toString();});
						// return res.json({liked_by: liked_by, created_by: created_by});
						return res.json({likedBySwapsPop});
					}
			});
		}
	});
}

module.exports = {
likeThisWork: likeThisWork,
getMySwaps: getMySwaps
};