var createError = require('http-errors');
require("dotenv").config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
var logger = require('morgan');



var app = express();

var http = require("http").createServer(app);

const index = require("./routes/index");

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION); // connect to our database

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected")
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs"); // set up ejs for templating
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/spanning", index);




const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log("now listening...", PORT)
});
module.exports = app;
