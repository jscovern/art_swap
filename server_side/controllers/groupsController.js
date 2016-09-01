var Gallery = require('../models/galleries');
var User = require('../models/users');
var Group = require('../models/groups');
var app = require('../../server.js');

function newGroup(req,res) {
	var group = new Group(req.body);
	group.save(function(err) {
		if(err){
			console.log('error saving new group '+err);
			return res.json({url: '/#/mygroups/'+req.user._id,message:"Error saving group: "+err, error: true});
		}else {
			console.log('group saved successfully');
			return res.json({url: '/#/mygroups/'+req.user._id,message:"Saved group!", error: false});
		}
	});
}

function getMyGroups(req,res) {
	var user_id = req.params.id;
	console.log('in the getmygroups');
	var newGroups = [];
	Group.find({active_users: user_id}).populate('active_users').exec(function(error,groups) {
		if(error) {
			console.log(error);
			return res.json({message: "Error getting your groups b/c: "+error, error:true});
		}
		return res.json(groups);
	});
}


function addUserToGroup(req,res) {
	var user_id = req.body.user_id;
	var group_id = req.body.group_id;
	Group.findById({_id: group_id}, function(error, group) {
		if(error) {
			console.log(error);
			return res.json({message: "Error finding the group to add to: "+error, error:true});
		}
		group.active_users.push(user_id);
		group.save(function(err) {
			if(err) {
				console.log(error);
				return res.json({message: "Error saving the group to add to: "+error, error:true});			
			}else {
				console.log('user added to group successfully');
				return res.json({url: '/#/mygroups/'+req.user._id});
			}
		});
	});
}


module.exports = {
newGroup: newGroup,
getMyGroups: getMyGroups,
addUserToGroup: addUserToGroup,
};