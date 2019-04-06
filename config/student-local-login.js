var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/signup');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(
  new LocalStrategy(
  function(username, password, done) {
    User.findOne({email: username}).then(function(user){
      if(!user){
        return done(null, false, {message: 'Unknown User'});
      }

      if(password == user.password){
        return done(null, user);
      }
      else{
        return done(null, false, {message: 'Invalid Password'});
      }
   });
  }
));
