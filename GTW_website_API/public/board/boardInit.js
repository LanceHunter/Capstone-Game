/*
some globals
*/
let playerIDs;
let colors = [0x550000, 0x005500, 0x000055];
let subIcons = [], bomberIcons = [], capitalIcons = [], missileIcons = [];
let width = boardWidth;
let height = width * (9 / 16);
let pointersPositions = [null, null, null];
let playerPointers = [];
let map;
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
callback for game changes
*/
function onGameChange(data) {
  game = data.val();
  // board score stuff
  subIcons.forEach(subIcon => subIcon.update());
  bomberIcons.forEach(bomberIcon => bomberIcon.update());
  missileIcons.forEach(missileIcon => missileIcon.update());
  capitalIcons.forEach(capitalIcon => capitalIcon.update());

  // vue hud data updates
  hud.players = game.players;
  for (let name in hud.players) {
    hud.players[name].name = name;
  }
  hud.war = game.war;
  hud.year = game.year;
}
