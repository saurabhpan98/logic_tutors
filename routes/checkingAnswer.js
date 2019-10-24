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
var StudentsAnswers = require('../models/studentsAnswers');

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

router.post('/submitAnswer', function(req, res){
  //console.log(req.body.answer);

  StudentsAnswers.findOne({studentID: req.user._id}).then(function(object){
      //if user solves for first time

      var currentAnswer = {
        questionID: req.body.qId,
        subject: req.body.subject,
        answerStatus: req.body.answer
      }

      if(object == null){
        var newObject = new StudentsAnswers({
          //_id: req.user._id,
          studentID: req.user._id,
          answer: [currentAnswer]
        });

        newObject.save().then(function(firstMessageSaved){
          res.redirect('/profile');
        });
      }

      else{ //if user is not solving for first time
        StudentsAnswers.findOne({studentID: req.user._id}).then(function(userAnswerObject){
          var allAnswers = userAnswerObject.answer;
          allAnswers.push(currentAnswer);

          StudentsAnswers.findOneAndUpdate({studentID: req.user._id}, {answer: allAnswers}).then(function(result){
            res.redirect('/profile');
          });
        });
      }
  });
});

module.exports = router;
