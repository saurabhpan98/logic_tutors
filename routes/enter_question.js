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
var Question = require('../models/questions-model');

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


//enter-Questions
router.get('/enter-questions', function(req, res){
  if(req.user){
    res.render('enter-questions', {user: req.user});
  }
  else{
    res.redirect('/faculty-signin');
  }
});

router.post('/enter-questions', function(req, res){
  if(req.body.id == 'Simple Question'){ //simple_question
    var newQuestion = new Question({
      id: req.body.id,
      subject: req.body.subject,
      class: req.body.class,
      question: req.body.question,
      option_1: null,
      option_2: null,
      option_3: null,
      option_4: null,
      answer: req.body.answer
    });

    newQuestion.save().then(function(saved_question){
      res.redirect('/enter-questions');
    });
  }
  else{
    var newQuestion = new Question({  //MCQ_question
      id: req.body.id,
      subject: req.body.subject,
      class: req.body.class,
      question: req.body.question,
      option_1: req.body.option_1,
      option_2: req.body.option_2,
      option_3: req.body.option_3,
      option_4: req.body.option_4,
      answer: req.body.answer
    });

    newQuestion.save().then(function(saved_question){
      res.redirect('/enter-questions');
    });
  }
});


//getting questions
router.get('/getQuestions', function(req, res){
  Question.find({}).then(function(data){
    res.json({data: data});
  })
})

module.exports = router;
