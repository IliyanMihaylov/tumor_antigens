var express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

global.antigen = require('./models/antigens');
var antigens = require('./routes/antigens');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://antigensapp:qazwsx123@mongodb:27017/antigens", { useNewUrlParser: true, useUnifiedTopology: true });

var app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

antigens(app);

app.listen(PORT, HOST);

module.exports = app;
