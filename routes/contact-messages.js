var router = require('express').Router();

var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

//self made routes
var Signup = require('../models/signup');
var Contact = require('../models/contact-model');

var local = require('../config/student-local-login');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
router.use(cookieParser());

//for local strategy
// Express Session
router.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));


// Passport initialize
router.use(passport.initialize());
router.use(passport.session());


router.get('/contact-messages', function(req, res){
  if(req.user){
    Contact.find({}).then(function(allMessages){
      res.render('contact-messages', {user: req.user, allMessages: allMessages});
    });
  }
  else{
    res.redirect('/faculty-signin');
  }
});


//composed message rendering
router.post('/composeMessageSubmit', function(req, res){
  //console.log(req.body);
  console.log('The message has been sent by: ' + req.user.name + ' to: ' + req.body.composeTo);
  res.redirect('/contact-messages');
});


//deleting message upon clicking on Delete button
router.post('/messageDelete', function(req, res){
  Contact.findOneAndRemove({_id: req.body.id}).then(function(deletedMessage){
    console.log('The message deleted is: ' + deletedMessage.message);
  })
  //console.log(req.body);
  res.redirect('/contact-messages');
});

module.exports = router;
