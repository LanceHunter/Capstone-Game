/*
  Container file for any nessecary global variables
*/

// tracking
const minDistSq = Math.pow(100, 2);
const maxTime = 1000;
const redTargetColor = "#dca1a8";
const greenTargetColor = "#7ebe86";
const blueTargetColor = "#7373e6";
const boardMinBrightness = 50;
const boardMaxBrightness = 260;
const boardWidth = 1920;
const boardHeight = boardWidth * (9 / 16);

// alphas for the board icons
const deadAlpha = 0.2;
const liveAlpha = 1;
const peaceAlpha = 1;

// the gameID in firebase
let gameID;
// the game object from firebase
let game;
// an ordered list of playerIDs
let playerIDs;
// a parallel array with playerIDs with the color for each player
let colors = [0x8f0018, 0x657700, 0x006e77];
// all of the icons on the board
let subIcons = [], bomberIcons = [], capitalIcons = [], missileIcons = [];
// some stuff for scaling
let width = boardWidth;
let height = width * (9 / 16);

// the phaser game object
let phaser;
// the three PlayerPointers
let pointers;

// create the global lasers object used by the game as pointers
const lasers = [null, null, null];
