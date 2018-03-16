'use strict';


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 8888;
const admin = require("firebase-admin");


// const config = {
//   apiKey: process.env.APIKEY,
//   authDomain: process.env.AUTHDOMAIN,
//   databaseURL: process.env.DATABASEURL,
//   projectId: process.env.PROJECTID,
//   storageBucket: process.env.STORAGEBUCKET,
//   messagingSenderId: process.env.MESSAGINGSENDERID
// };

const serviceAccount = require('./globalthermonuclearwargame-firebase-adminsdk-mcs5b-ec18bb03a7.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASEURL
});
