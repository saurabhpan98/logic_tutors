var router = require('express').Router();

var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

//self made routes
var User = require('../models/signup');
var Contact = require('../models/contact-model');
var StudentMessages = require('../models/student-messages-model');

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



router.get('/myMessages', function(req, res){
  if(req.user){
    StudentMessages.findOne({email: req.user.email}).then(function(studentMessageObject){
      var allMessages = studentMessageObject.messages;
      res.render('myMessages', {user: req.user, allMessages: allMessages});
    });
  }else{
    res.redirect('/signin');
  }
})



router.post('/saveStudentMessage', function(req, res){
  //console.log(req.body);
  StudentMessages.findOne({email: req.body.composeTo}).then(function(resultObject){
    if(resultObject){ //if 'To' user has object then save it
      //console.log('Object present');
      var newMessage = {
        from: req.user.email,
        subject: req.body.composeSubject,
        message: req.body.composeMessage
      }

      var tempMessages = resultObject.messages;
      tempMessages.push(newMessage);

      StudentMessages.findOneAndUpdate({_id: resultObject._id}, {messages: tempMessages}).then(function(object){
        console.log('Another message saved..');
      });
    }
    if(resultObject == null){
      //console.log('no object present');
      //finding ID of Receiver
      User.findOne({email: req.body.composeTo}).then(function(idObject){
        //first message
        var newMessage = {
          from: req.user.email,
          subject: req.body.composeSubject,
          message: req.body.composeMessage
        };

        //no object present, create a new one
        var newObject = new StudentMessages({
          personalid: idObject._id,  //this will be the personal ID of user
          email: idObject.email,
          messages: [newMessage]
        });
        // newObject.messages.push(newMessage);

        //entering first object into the database
        newObject.save().then(function(result){
          console.log(result.email);
        });
      });
    }
  })
  res.redirect('/myMessages');
});


router.post('/studentMessageDelete', function(req, res){
  StudentMessages.findOne({personalid: req.user._id}).then(function(userObject){
    for(var i = 0; i<userObject.messages.length; i++){
      if(req.body.id == userObject.messages[i]._id){
        var newMessageArray = userObject.messages;
        newMessageArray.splice(i, 1);
        StudentMessages.findOneAndUpdate({personalid: req.user._id}, {messages: newMessageArray}).then(function(updatedObject){
          console.log('Message Deleted..');
        })
      }
    }
  });
  res.redirect('/myMessages');
})

module.exports = router;
