/*
some globals
*/
let playerIDs;
let colors = [0xe22245, 0x05f140, 0x5cc8ff];
let subIcons = [], bomberIcons = [], capitalIcons = [], missileIcons = [];
let width = boardWidth;
let height = width * (9 / 16);
let pointersPositions = [null, null, null];
let playerPointers = [];
let phaser;

function startGame(gameRef) {
  playerIDs = Object.keys(game.players);

  phaser = new Phaser.Game(width, height, Phaser.AUTO, phaserContainer);

  phaser.state.add('ContinentSelect', continent);
  // phaser.state.add('Peace', peace);
  // phaser.state.add('War', war);

  // and we launch our ContinentSelect state
  phaser.state.start('ContinentSelect');

  document.getElementById('hud').style.visibility = 'visible';
  gameRef.on('value', onGameChange);
}

/*
phaser setup
*/

let map;
