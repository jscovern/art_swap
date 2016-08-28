var User = require('../models/users');
var app = require('../../server.js');
var passport = require('passport');
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var session=require('express-session');
app.use(require('express-session')({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//passport auth
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser( function(user, done) {
  var sessionUser = { _id: user._id, firstname: user.firstname, lastname: user.lastname, is_admin: user.is_admin };
  console.log(sessionUser);
  done(null, sessionUser);
});

passport.deserializeUser( function(sessionUser, done) {
  // The sessionUser object is different from the user mongoose collection
  // it's actually req.session.passport.user and comes from the session collection
  done(null, sessionUser);
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
				res.redirect('/');
			}
			newUser.password = hash;
		});

		newUser.save(function(err) {
			if(err) {
				console.log('error saving newuser: '+err);
			}
			console.log('newuser save successful');
			// login(newUser);
			return response.json({success: 'success'});
		});
}

function login(req,res,next) {
	passport.authenticate('local', { failureRedirect: '/login' },
		  function(req, res) {
		  	console.log('res is: '+res);
		  	if(res) {
			  	return {success: 'success'};		  		
		  	}
		})(req,res,next);
		console.log('motherfucker');
		console.dir(req.session);
}

passport.use(new LocalStrategy({usernameField: 'email'},
  function(email, password, done) {
  	console.log('in the localstrategy');
    User.findOne({ email: email }, function (err, user) {
    	console.log('user is: '+user);
    	console.log("err is; "+err);
      if (err) { 
      	console.log("unknown error"+err);
      	return done(err); 
      }
      if (!user) { 
      	console.log("no user found" + user);
      	return done(null, false); 
      }
      user.validatePassword(password,function(err,result) {
      	console.log('validatepassword err is: '+err);
      	console.log('validatepassword result is: '+result);
      	if(err || !result){
      		console.log('incorrect password');
      		return done(null,false,{message:'Incorrect password'});
      	}else {
      		console.log('logged in');
      		return done(null,user);
      	}
      });
    });
  }
));

function logout(req,res) {
	req.logout();
	res.redirect('/');
}

module.exports = {
	createNewUser: createNewUser,
	logout: logout,
	login: login
};