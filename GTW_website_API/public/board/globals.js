/*
  Container file for any nessecary global variables
*/

/*
  from alignment.js
*/

// set variables for tracking program
const minDistSq = Math.pow(100, 2);
const maxTime = 1000;
const redTargetColor = "#dca1a8";
const greenTargetColor = "#7ebe86";
const blueTargetColor = "#7373e6";
const boardMinBrightness = 50;
const boardMaxBrightness = 260;
const boardWidth = 1920;
const boardHeight = boardWidth * (9 / 16);
const alphaAdjust = 1;
let gameID;
let game;
let playerIDs;
let colors = [0x8f0018, 0x657700, 0x006e77];
let subIcons = [], bomberIcons = [], capitalIcons = [], missileIcons = [];
let width = boardWidth;
let height = width * (9 / 16);
let map;
let phaser;
let pointers;

// create the global lasers object used by the game as pointers
const lasers = [null, null, null];

// are we testing?
const testing = true;
