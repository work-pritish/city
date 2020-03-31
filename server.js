var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//database connnection 
mongoose.connect('mongodb://localhost/2701', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});
//for session
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));


//middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

//connectiong routes here

//routes variables
var index = require('./routes/index');
var auth= require('./routes/auth');
var profile = require('./routes/profile');
var search = require('./routes/search');

//routes connection with variables
app.use(index);
app.use(auth);
app.use(profile);
app.use(search);

//for error handling
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// Port listening at 8080
app.listen(8080, function () {
  console.log('Server listening at port: 8080');
});

