var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newSchema = new Schema({
  //_id: {}, 
  studentID: String,
  answer: [
    {
      questionID: String,
      subject: String,
      answerStatus: String
    }
  ]
});

var StudentsAnswers = mongoose.model('studentsanswers', newSchema);

module.exports = StudentsAnswers;
