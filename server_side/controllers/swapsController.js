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

module.exports = {
likeThisWork: likeThisWork
};