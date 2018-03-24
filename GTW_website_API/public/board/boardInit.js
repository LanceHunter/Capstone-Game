/*
some globals
*/
let game, firebaseRef, playerIDs, playerIndices;
let colors = [0xe22245, 0x05f140, 0x5cc8ff];
let subIcons = [], bomberIcons = [], capitalIcons = [], missileIcons = [];
let width = 1920;
let height = width * (9 / 16);
let pointersPositions = [null, null, null];
let playerPointers = [];

/*
firebase setup
*/
const database = firebase.database();

/*
testing
*/
firebaseRef = database.ref('gameInstance').child('game8928');

// here we just get the initial game state
// it should have players with nothing assigned
firebaseRef.once('value', data => {game = data.val()});

/*
phaser setup
*/
let phaser = new Phaser.Game(width, height, Phaser.AUTO);

phaser.state.add('ContinentSelect', continent);
// phaser.state.add('Peace', peace);
// phaser.state.add('War', war);

// and we launch our ContinentSelect state
phaser.state.start('ContinentSelect');
