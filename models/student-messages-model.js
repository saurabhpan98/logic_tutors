var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newSchema = new Schema({
  personalid: String,  //this will be the personal ID of user
  email: String,
  messages: [  //array of messages
    {
      from: String,
      subject: String,
      message: String
    }
  ]
});

var StudentMessages = mongoose.model('studentmessages', newSchema);

module.exports = StudentMessages;
