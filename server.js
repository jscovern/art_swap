var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
app.use(express.static('./front_end/public')); //this serves up the public folder into the root directory
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//database
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/art_swap");
// start server
app.listen(port, function() {
  console.log('Server started on', port); 
});
//routes setup
var routes = require("./server_side/routes/routes");
app.use(routes);
var passport = require('passport');
app.use(require('express-session')({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use( express.cookieParser() );

module.exports = app;