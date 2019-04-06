var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var signupSchema = new Schema({
  email: String,
  password: String,
  name: String,
  age: Number,
  address: String,
  phone: String,
  gender: String,
  class: Number,
  classrank: Number,
  status: String     //this shows whether user is faculty or student
});

var Signup = mongoose.model('signup', signupSchema);

module.exports = Signup;
