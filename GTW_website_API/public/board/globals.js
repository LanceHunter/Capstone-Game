/*
  Container file for any nessecary global variables
*/

/*
  from alignment.js
*/

// set variables for tracking program
const minDistSq = Math.pow(30, 2);
const maxTime = 1000;
const redTargetColor = "#dcaaaa";
const greenTargetColor = "#7ebe86";
const blueTargetColor = "#7373e6";
const boardMinBrightness = 50;
const boardMaxBrightness = 260;
const boardWidth = 1920;
const boardHeight = boardWidth * (9 / 16);
const alphaAdjust = 0.4;
let gameID;
let game;
let playerIDs;
let colors = [0xff0000, 0x00ff00, 0x0000ff];
let subIcons = [], bomberIcons = [], capitalIcons = [], missileIcons = [];
let width = boardWidth;
let height = width * (9 / 16);
let map;
let phaser;
let pointers;

// create the global lasers object used by the game as pointers
const lasers = [null, null, null];
