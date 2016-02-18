var express = require('express');

var app = express();

require('./routes/routes.js')(app, express);

module.exports = app;
