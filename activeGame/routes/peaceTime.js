'use strict';

// Firebase setup.
const admin = require("firebase-admin");
const firebase = admin.database();
const ref = firebase.ref('gameInstance');


//Setting up express routing
const express = require('express');
const router = express.Router();







module.exports = router;
