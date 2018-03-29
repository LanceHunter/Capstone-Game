function startGame(gameRef) {
  playerIDs = Object.keys(game.players);

  phaser = new Phaser.Game(width, height, Phaser.AUTO, phaserContainer);

  phaser.state.add('ContinentSelect', continent);
  phaser.state.add('Peace', peace);
  phaser.state.add('War', war);

  phaser.state.start('ContinentSelect');

  document.getElementById('hud').style.visibility = 'visible';
  gameRef.on('value', onGameChange);
}

/*
callback for game changes
*/
function onGameChange(data) {
  game = data.val();

  // state switcher
  if (game.war && phaser.state.current != 'War') {
    phaser.state.start('War');
  } else if (game.peacetime && phaser.state.current != 'Peace'){
    phaser.state.start('Peace');
  }

  // check for game over
  if (game.gameOver) {
    gameOverModal.outcome = game.gameOver.outcome;
    gameOverModal.winner = game.gameOver.winner;
    document.getElementById('gameOverModal').style.visibility = 'visible';
  }

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
  hud.gameID = gameID;
}
