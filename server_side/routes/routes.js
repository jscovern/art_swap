var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser');
var usersController = require('../controllers/usersController');
module.exports = router;

router.route('/register')

  .post(usersController.createNewUser);

 router.route('/logout')
 	.get(usersController.logout);

 router.route('/login')
 	.post(usersController.login);
