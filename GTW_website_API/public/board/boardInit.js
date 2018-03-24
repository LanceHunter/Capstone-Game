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
let phaser;

/*
firebase setup
*/
const database = firebase.database();

/*
testing db
*/
firebaseRef = database.ref('gameInstance').child('game8928');

// get our initial game object and launch
firebaseRef.once('value', data => {
  game = data.val();
  // set up the player lookup structures
  playerIDs = Object.keys(game.players);
  playerIndices = {};
  for (let i = 0; i < playerIDs.length; i++) {
    playerIndices[game.players[playerIDs[i]]] = i;
  }
  phaser = new Phaser.Game(width, height, Phaser.AUTO);

  phaser.state.add('ContinentSelect', continent);
  phaser.state.add('Alignment', align);
  // phaser.state.add('Peace', peace);
  // phaser.state.add('War', war);

  // and we launch our ContinentSelect state
  phaser.state.start('Alignment');
});



/*
phaser setup
*/

let align = {
  preload: function() {
    this.game.load.image('map', '/board/assets/map.png');
  },
  create: function() {
    this.game.add.sprite(0, 0, 'map');
  },
  update: function() {

  }
}
