/*
some globals
*/
let playerIDs;
let colors = [0xe22245, 0x05f140, 0x5cc8ff];
let subIcons = [], bomberIcons = [], capitalIcons = [], missileIcons = [];
let width = boardWidth; //1920;
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
firebaseRef = database.ref('gameInstance').child(gameID);

// get our initial game object and launch
firebaseRef.once('value', data => {
  game = data.val();
  // set up the player lookup structures
  playerIDs = Object.keys(game.players);
  phaser = new Phaser.Game(width, height, Phaser.AUTO, phaserContainer);

  phaser.state.add('ContinentSelect', continent);
  phaser.state.add('Alignment', alignState);
  // phaser.state.add('Peace', peace);
  // phaser.state.add('War', war);

  // and we launch our ContinentSelect state
  phaser.state.start('Alignment');
});



/*
phaser setup
*/

let map;
