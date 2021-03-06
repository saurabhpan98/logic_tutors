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
var User = require('../models/signup');

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


var currentClass = '';

router.get('/mark-attendance', function(req, res){
  if(req.user){
    res.render('mark-attendance', {user: req.user})
  }
  else{
    res.redirect('/faculty-signin');
  }
});

router.post('/mark-attendance', function(req, res){
  currentClass = req.body.class;
  res.redirect('/mark-attendance-class');
});


router.get('/mark-attendance-class', function(req, res){
  if(req.user){
    User.find({class: currentClass}).then(function(allStudents){
      res.render('mark-attendance-class', {user: req.user, allStudents: allStudents});
      currentClass = '';
    })
  }
  else{
    res.redirect('/faculty-signin');
  }
});


router.post('/mark-attendance-class', function(req, res){
  User.findOne({_id: req.body.id}).then(function(person){
    if(req.body.attendanceStatus == 'P'){
      console.log(person.name + ' is marked present');
    }
    else{
      console.log(person.name + ' is marked absent');
    }
  })
  res.redirect('/mark-attendance-class');
})


module.exports = router;
