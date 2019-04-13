var router = require('express').Router();

var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
router.use(cookieParser());

//self-made modules
var local = require('../config/faculty-local-signin');
var Signup = require('../models/signup');

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



//rendering
//faculty signin
router.get('/faculty-signin', function(req, res){
  Signup.find({}).then(function(allUsers){
    res.render('faculty-signin', {user: req.user, allUsers: allUsers});
  })
});

router.post('/faculty-signin', passport.authenticate('local'), function(req, res){
  console.log(req.user.name + ' logged in..');

  res.redirect('/faculty-profile');
});


//faculty profile
router.get('/faculty-profile', function(req, res){
  if(req.user){
    res.render('faculty-profile', {user: req.user});
  }
  else{
    res.redirect('/faculty-signin');
  }
});


router.get('/getStudents', function(req, res){
  Signup.find({}).then(function(data){
    res.json({data: data});
  })
})



module.exports = router;
