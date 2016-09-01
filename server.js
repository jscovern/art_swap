var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var port = server.listen(process.env.PORT || 3000);
app.use(express.static('./front_end/public')); //this serves up the public folder into the root directory
app.use(cookieParser());
var bodyParser = require("body-parser");
// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//database
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/art_swap");
// start server
app.listen(port, function() {
  console.log('Server started on', port); 
});
//routes setup
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({
	secret: 'mySecretKey',
	saveUninitialized: true,
	resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());
var routes = require("./server_side/routes/routes")(app,passport);
app.use('/',routes);

module.exports = app;