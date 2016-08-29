var User = require('../models/users');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');

var app = require('../../server.js');

passport.serializeUser( function(user, done) {
  var sessionUser = { _id: user._id, firstname: user.firstname, lastname: user.lastname, admin_user: user.admin_user };
  console.log("sessionuser is: "+sessionUser);
  done(null, sessionUser);
});

passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user);
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
		  	if(err) {return next(err);}
		  	if(!user){return res.json({url: '/#/login', message: info.message});}
		  	req.logIn(user,function(err) { //need to explicitly call req.login here, so that serializing happens: http://stackoverflow.com/questions/36525187/passport-serializeuser-is-not-called-with-this-authenticate-callback
		  		if (err) {return next(err);}
		  		return res.json({url: '/#/profile/'+user._id, user: user, requser: req.user, reqsession: req.session});
		  	});
		  })(req,res,next);
		}


passport.serializeUser( function(user, done) {
  console.log('inside of serializuser');
  console.log(user);
  var role="";
  if(user.admin_user) {role="admin";}
  var sessionUser = { _id: user._id, firstname: user.firstname, lastname: user.lastname, role: role };
  console.log("sessionuser is: "+sessionUser);
  done(null, sessionUser);
});

passport.deserializeUser( function(sessionUser, done) {
	console.log('in deserialize');
  User.findById(sessionUser._id, function(err, user) {
    done(err, user);
  });
});

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
	console.log('in getUserInfo');
	var id = req.params.id;
	console.log(id);
	console.log(req.user);
	User.findById({_id: id}, function(error,user) {
	if(error) {
		res.json({message: "Couldn't find the user b/c "+error});
	}
	res.json({user: user});
});

}

// function home(req,res) {
// 	console.log('in the home');
// 	console.dir(req.user);
// 	return {user: req.user};
// }

module.exports = {
	createNewUser: createNewUser,
	logout: logout,
	login: login,
	getUserInfo: getUserInfo
	// home: home
};