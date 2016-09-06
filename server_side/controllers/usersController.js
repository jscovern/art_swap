var User = require('../models/users');
var Gallery = require('../models/galleries');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');

var app = require('../../server.js');

passport.serializeUser( function(user, done) {
  var sessionUser = { _id: user._id, firstname: user.firstname, lastname: user.lastname, admin_user: user.admin_user };
  done(null, sessionUser);
});

passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

//post
function createNewUser(request,response) {
	var newUser = new User();
		newUser.email = request.body.email;
		newUser.password = request.body.password;
		newUser.join_date = request.body.join_date;
		newUser.admin_user = request.body.admin_user;
		newUser.personal_bio = request.body.personal_bio;
		newUser.firstname = request.body.firstname;
		newUser.lastname = request.body.lastname;

		User.hashPassword(newUser.password, function(err,hash) {
			if(err) {
				console.log('err');
			}
			newUser.password = hash;
		});

		newUser.save(function(err) {
			if(err) {
				console.log('error saving newuser: '+err);
				return response.json({url: "/#/register", message: "Error saving user: "+err, error: true});
			}
			console.log('newuser save successful');
			// login(newUser);
			return response.json({url: "/#/login", message: 'Successfully created your new user!', error: false});
		});
}

function login(req,res,next) {
	passport.authenticate('local', {failureFlash: true },
		  function(err, user,info) {
		  	if(err) {err="Incorrect Password or Email!";return next(err);}
		  	if(!user){info.message = "Incorrect Email or Password!";return res.json({url: '/#/login', message: info.message});}
		  	req.logIn(user,function(err) { //need to explicitly call req.login here, so that serializing happens: http://stackoverflow.com/questions/36525187/passport-serializeuser-is-not-called-with-this-authenticate-callback
		  		if (err) {err="Incorrect Password!";return next(err);}
		  		return res.json({url: '/#/profile/'+user._id, user: user});
		  	});
		  })(req,res,next);
		}

passport.use(new LocalStrategy({usernameField: 'email'},
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { 
      	return done(err); 
      }
      if (!user) { 
      	return done(null, false,{message:'Provided email does not exist in our records!'}); 
      }
      user.validatePassword(password,function(err,result) {
      	if(err || !result){
      		return done(null,false,{message:'Incorrect password'});
      	}else {
      		return done(null,user);
      	}
      });
    });
  }
));

function logout(req,res) {
	req.logout();
	return res.json({url: '/#/login'});
}

function getUserInfo(req,res) {
	var id = req.params.id;
	console.log('id is: '+id);
	User.findById({_id: id}, function(error,user) {
		console.log('user is: '+user);
	if(error) {
		return res.json({message: "Couldn't find the user b/c "+error});
	}
		Gallery.find({_id: {$in: user.galleries}}, function(err,galleries){
			if(err) {
				return res.json({message: "Couldn't find the galleries for the user b/c "+err});
			}else{
				return res.json({user: user, usergalleries: galleries});
			}
		});
	});
}

function updateUser(req,res) {
	var id = req.params.id;
	var userToUpdate = new User(req.body);
	User.findById({_id: id}, function(error,user) {
		if(error) {
			console.log(error);
		}
		user.img_url = req.body.img_url;
		user.save(function(error) {
			if(error) {
				console.log(error);
				return error;
			}
			console.log(error);
		});
	});
}

function allUsers(req,res) {
	User.find({}, function(error,users) {
		if(error) {
			console.log(error);
		} else{
			return res.json(users);
		}
	});
}

module.exports = {
	createNewUser: createNewUser,
	logout: logout,
	login: login,
	getUserInfo: getUserInfo,
	updateUser: updateUser,
	allUsers: allUsers
};