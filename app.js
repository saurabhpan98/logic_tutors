var express = require('express');
var mongoose = require('mongoose');

//self made routes
var links = require('./routes/links');
var faculty_links = require('./routes/faculty_links');
var enter_questions = require('./routes/enter_question');
var mark_attendance = require('./routes/mark_attendance');
var contact_messages = require('./routes/contact-messages');
var studentMessages = require('./routes/student-messages');

var app = express();

//var port = process.env.PORT || 8080

app.set('view engine', 'ejs');
app.use(express.static('views'));

mongoose.connect('mongodb://localhost/tutorsDB');
//mongoose.connect('mongodb://saurabh-panchal:logictutors1@ds145790.mlab.com:45790/logictutors')

//routes
app.use('/', links);
app.use('/', faculty_links);
app.use('/', enter_questions);
app.use('/', mark_attendance);
app.use('/', contact_messages);
app.use('/', studentMessages);


app.listen(3000, function(){
  console.log('logic tutors app running...');
});

//this is important for hosting
/*
app.listen(port, () => {
  console.log('App running..');
});*/
