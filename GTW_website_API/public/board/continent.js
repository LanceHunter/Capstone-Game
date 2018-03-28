let continent = {
  preload: function() {
    this.game.load.image('map', '/board/assets/map.png');
    this.game.load.image('capital', '/board/assets/capital.png');
    this.game.load.bitmapFont('closeness', '/board/assets/fonts/closeness.png', '/board/assets/fonts/closeness.fnt');
    this.game.load.image('circle', '/board/assets/circle.png');
  },
  create: function() {
    capitalIcons = [];
    this.game.add.sprite(0, 0, 'map');
    capitalIcons.push(new CapitalIcon(365, (1080 - 500), 'northAmerica'));
    capitalIcons.push(new CapitalIcon(560, (1080 - 200), 'southAmerica'));
    capitalIcons.push(new CapitalIcon(1425, (1080 - 470), 'asia'));
    capitalIcons.push(new CapitalIcon(1095, (1080 - 565), 'europe'));
    capitalIcons.push(new CapitalIcon(1635, (1080 - 180), 'australia'));
    capitalIcons.push(new CapitalIcon(955, (1080 - 365), 'africa'));

    pointers = [];
    for (let i = 0; i < playerIDs.length; i++) {
      pointers.push(new PlayerPointer(i, this))
    }
  },
  update: function() {
    pointers.forEach((pointer) => {
      if (Object.keys(game.players[pointer.playerID].continents).length <= 6 / players.length) {
        pointer.setPosition();
        if (!pointer.intersecting()) {
          capitalIcons.some((capital) => {
            let data = {
              gameID: gameID,
              playerID: playerIDs[pointer.playerIndex],
              continent: capital.continent,
            };
            return !game.continents[capital.continent].player &&
                    pointer.checkIntersection(capital.sprite, this.assignContinent, data);
          })
        }
      }
    });

    if (capitalIcons.every(capital => game.continents[capital.continent].player)) {
      $.post('/api/pregame/beginpeace', {gameID: gameID}).then(() => {
        phaser.state.start('Peace');
      });
    }
  },

  assignContinent: function(data) {
    $.post('/api/pregame/continentselect', data);
  }
}
