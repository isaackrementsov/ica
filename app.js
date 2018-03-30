//required modules
var User = require("./models/users");
var About = require("./models/abouts");
var session = require("express-session");
var helmet = require("helmet");
var expressValidator = require("express-validator");
var mongoose = require("mongoose");
var path = require("path");
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var bodyParser = require('body-parser');
var ejs = require('ejs');
var routes = require('./server/routes');
var rateLimiter = require("express-rate-limit");
//Prevent website being copied in <iframe> HTML elements
app.use(helmet({
  frameguard: {action: "deny"}
}));
//Module middleware or setup
app.set('port', process.env.PORT || 443);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017/ilyawebsite");
//Tell app to listen on port 443
app.listen(app.get('port'), function(){
  console.log("server started");
});
//Cookie settings
app.use(session({
  secret: 'yVVma9ga',
  saveUninitialized: true,
  resave: true,
  cookie: {httpOnly: true}
}));
//Set up form checking
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//Limits requests to 37 over 37.5 seconds (about 1 per second) to prevent DOS attacks
var limiter = new rateLimiter({
  windowMs: 5*7.5*1000,
  max: 37,
  delayMs: 1
});
app.use(limiter);
User.findOne({}, function(err,doc){
    if(!doc){
        var user = new User({name:"Ilya", password:"Lo85564t%!dS"});
        user.save(function(err){
            if(err){
                console.log(error)
            }
        })
    }
});
//IMPORTANT; sends requests to app to routes module in server folder
routes(app);
