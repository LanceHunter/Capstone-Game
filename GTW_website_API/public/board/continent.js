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

    trackers = [
      new PlayerPointer(this),
      new PlayerPointer(this),
      new PlayerPointer(this),
    ]
  },
  update: function() {
    trackers.forEach((tracker, index) => {
      tracker.sprite.position = lasers[index] || {x: 0,y: 0};
    })

    let finished = true;
    capitalIcons.forEach((capital) => {
      if (!game.continents[capital.continent].player) {
        finished = false;
        trackers.forEach((tracker, index) => {
          let data = {
            gameID: gameID,
            playerID: playerIDs[index],
            continent: capital.continent,
          }
          if (index === 0) {
            capital.checkOverlap(tracker, this.assignPlayer, data);
          }
        })
      }
    })

    if (finished) {
      console.log('changing state to peacetime');
    }
  },
  assignPlayer: function(data) {
    console.log('***********************');
    console.log('MADE ASSIGNMENT');
    console.log('***********************');
    $.post('/api/pregame/continentselect', data);
  }
}
