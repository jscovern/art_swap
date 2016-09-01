var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser');
var usersController = require('../controllers/usersController');
var galleriesController = require('../controllers/galleriesController');
var groupsController = require('../controllers/groupsController');
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
router.get('/api/user/:id',usersController.getUserInfo);
router.put('/api/user/edit/:id',isAuth,usersController.updateUser);
router.post('/api/gallery/new',galleriesController.createGallery);
router.post('/api/work/new/:id',galleriesController.createWork);
router.post('/api/group/new/:id',groupsController.newGroup);
router.get('/api/user/groups/:id',groupsController.getMyGroups);
router.get('/api/users',usersController.allUsers);
router.post('/api/usersingroup/new', groupsController.addUserToGroup);
router.get('/api/gallery/:id', galleriesController.getGallery);
return router;
};