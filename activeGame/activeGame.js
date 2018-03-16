'use strict';


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 8888;

const preGame = require('./routes/preGame.js');
const peaceTime = require('./routes/peaceTime.js');
//const war = require('./routes/war.js');

// Disabling the x-powered-by: Express header, for security.
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('short'));

app.use('/pregame', preGame);
app.use('/peacetime', peaceTime);
// app.use('/war', war);


// Turning on listening on the specified port.
app.listen(port, () => {
  console.log('Listening on port', port);
});


module.exports = app;
