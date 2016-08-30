var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser');
var usersController = require('../controllers/usersController');
var isAuth = function (req, res, next) {
  console.log('in isauth');
  console.log(req);
  if (req.isAuthenticated()){
  	console.log('req.isAuthenticated(): '+req.isAuthenticated());
    return next();
	}
  else{
  	res.redirect('/blah');
  }
};

module.exports = function(app,passport) {//router;

router.post('/register',usersController.createNewUser);
router.get('/logout', usersController.logout);
router.post('/login',usersController.login);
// router.get('/home',isAuth, usersController.home);
router.get('/api/user/:id',usersController.getUserInfo);
router.put('/api/user/edit/:id',usersController.updateUser);
return router;
};