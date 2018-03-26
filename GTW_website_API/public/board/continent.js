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

    this.red = {
      sprite: this.game.add.sprite(0, 0, 'circle'),
      intersection: null,
    }
    this.green = {
      sprite: this.game.add.sprite(0, 0, 'circle'),
      intersection: null,
    }
    this.blue = {
      sprite: this.game.add.sprite(0, 0, 'circle'),
      intersection: null,
    }

    trackers = [
      this.red,
      this.green,
      this.blue,
    ];

    trackers.forEach((tracker) => {
      tracker.sprite.tint = 0x550000;
      // tracker.alpha = 0;
      tracker.sprite.scale.set(0.2);
    })
  },
  update: function() {
    let intersections = [null, null, null]
    trackers.forEach((tracker, index) => {
      tracker.sprite.position = lasers[index] || {x: 0,y: 0};

      if (tracker.intersection) {
        if(!tracker.intersection.checkOverlap()) {
          tracker.intersection = null;
        };
      } else {
        capitalIcons.forEach((capital) => {
          if (!game.continents[capital.continent].player && tracker.sprite.overlap(capital.sprite)) {
            console.log('checked overlap!');
            let data = {
              gameID: gameID,
              playerID: playerIDs[index],
              continent: capital.continent,
            }

            tracker.intersection = new Intersection(tracker.sprite, capital.sprite, this.assignPlayer, data);
          }
        })
      }
    })

    if (capitalIcons.every(capital => game.continents[capital.continent].player)) {
      console.log('changing state to peacetime');
    }
  },
  assignPlayer: function(data) {
    $.post('/api/pregame/continentselect', data);
  }
}
