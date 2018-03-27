function startGame(gameRef) {
  playerIDs = Object.keys(game.players);

  phaser = new Phaser.Game(width, height, Phaser.AUTO, phaserContainer);

  phaser.state.add('ContinentSelect', continent);
  phaser.state.add('Peace', peace);
  phaser.state.add('War', war);

  /*
  THE REAL STUFF
  // and we launch our ContinentSelect state
  phaser.state.start('ContinentSelect');
  */

  // SHORT CIRCUIT
  phaser.state.start('War');

  document.getElementById('hud').style.visibility = 'visible';
  gameRef.on('value', onGameChange);
}

/*
callback for game changes
*/
function onGameChange(data) {
  game = data.val();
  // board score stuff
  subIcons.forEach(subIcon => subIcon.updateState());
  bomberIcons.forEach(bomberIcon => bomberIcon.updateState());
  missileIcons.forEach(missileIcon => missileIcon.updateState());
  capitalIcons.forEach(capitalIcon => capitalIcon.updateState());

  // vue hud data updates
  hud.players = game.players;
  for (let name in hud.players) {
    hud.players[name].name = name;
  }
  hud.war = game.war;
  hud.year = game.year;
}
