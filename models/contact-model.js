var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  message: String
});

var Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
