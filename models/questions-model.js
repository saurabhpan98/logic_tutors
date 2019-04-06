var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
  id: String,
  subject: String,
  class: Number,
  question: String,
  option_1: String,
  option_2: String,
  option_3: String,
  option_4: String,
  answer: String
});

var Question = mongoose.model('question', questionSchema);

module.exports = Question;
