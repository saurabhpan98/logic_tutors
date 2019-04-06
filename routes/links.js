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
var Question = require('../models/questions-model');
//var keys = require('./config/keys');
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


router.get('/', function(req, res){
  res.render('index', {user: req.user});
});

router.get('/about', function(req, res){
  res.render('about', {user: req.user});
});


//contact us form
router.get('/contact-us', function(req, res){
  res.render('contact', {user: req.user});
});

router.post('/contact-us', function(req, res){
  Contact.create(req.body).then(function(saved_contact){
    console.log('contact message saved by ' + saved_contact.name);
    res.redirect('/contact-us');
  });
});



router.get('/assignments', function(req, res){
  res.render('assignments', {user: req.user});
});


//signin routes
router.get('/signin', function(req, res){
  Signup.find({}).then(function(allUsers){
    res.render('signin', {user: req.user, allUsers: allUsers});
  });
});

router.post('/signin', passport.authenticate('local'), function(req, res){
  Signup.find({class: req.user.class}).then(function(classmates){

    //sorting the array according to rank
    for(var i = 0; i<classmates.length-1; i++){

      var min_index = i;
      for(var j = i + 1; j<classmates.length; j++){
        if(classmates[j].age < classmates[min_index].age){
          min_index = j;
        }
      }

      //swapping
      var temp = classmates[min_index];
      classmates[min_index] = classmates[i];
      classmates[i] = temp;
    }

    //sending questions
    Question.find({}).then(function(questions){
      res.render('profile', {user: req.user, classmates: classmates, questions: questions});
    });
  })
});


router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/signin');
})


router.get('/profile', function(req, res){
  if(req.user){
    Signup.find({class: req.user.class}).then(function(classmates){

      //sorting the array according to rank
      for(var i = 0; i<classmates.length-1; i++){

        var min_index = i;
        for(var j = i + 1; j<classmates.length; j++){
          if(classmates[j].age < classmates[min_index].age){
            min_index = j;
          }
        }

        //swapping
        var temp = classmates[min_index];
        classmates[min_index] = classmates[i];
        classmates[i] = temp;
      }

      //sending questions
      Question.find({}).then(function(questions){
        res.render('profile', {user: req.user, classmates: classmates, questions: questions});
      });
    })
  }
  else{
    res.redirect('/signin');
  }
});

router.get('/profile-details', function(req, res){
  if(req.user){
    res.render('profile-details', {user: req.user});
  }
  else{
    res.redirect('/signin');
  }
});


//signup routes
router.get('/signup', function(req, res){
  res.render('signup', {user: req.user});
});

router.post('/signup', function(req, res){
  //same email should not be present
  Signup.findOne({email: req.body.email}).then(function(person){

    if(person == null){ //email not present already, save it
      var firstPassword = req.body.password;
      var secondPassword = req.body.password_repeat;

      if(firstPassword == secondPassword){
        var newUser = new Signup({
          email: req.body.email,
          password: req.body.password,
          name: null,
          age: null,
          address: null,
          phone: null,
          gender: null,
          class: null,
          classrank: null,
          status: null
        })
        newUser.save().then(function(person){
          console.log(req.body);
          //res.redirect('/signup');
          res.render('signup-1', {user: person});
        });
        /*Signup.create(req.body).then(function(person){
          console.log(req.body);
          //res.redirect('/signup');
          res.render('signup-1', {user: person});
        });*/
      }
      else{
        console.log('Password not same..');
        res.redirect('/signup');
      }
    }
    else{ //email already present
      console.log('Email already present..');
      res.json('email present..');
    }
  });
});


router.get('/signup-next', function(req, res){
  res.render('signup-1');;
});

router.post('/signup-next', function(req, res){
  Signup.findOneAndUpdate({email: req.body.email}, {name: req.body.name, age: req.body.age, address: req.body.address, phone: req.body.phone, gender: req.body.gender, class: req.body.class, status: req.body.status}).then(function(result){
    console.log(result);
    res.render('congrats', {user: req.body.name});
    //res.redirect('/signin');
  });
});

//congratulations on signup completion
router.get('/congrats', function(req, res){
  res.render('congrats');
});




//getting data
router.get('/getData', function(req, res){
  Signup.find({}).then(function(data){
    res.json({data: data});
  })
})


module.exports = router;
