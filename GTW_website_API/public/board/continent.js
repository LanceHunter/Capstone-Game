let continent = {
  preload: function() {
    this.game.load.image('map', '/board/assets/map.png');
    this.game.load.image('capital', '/board/assets/capital.png');
    this.game.load.bitmapFont('closeness', '/board/assets/fonts/closeness.png', '/board/assets/fonts/closeness.fnt');

    // move the hudcontainer to fit canvas
    $('.hudcontainer').css('left', $('canvas').offset().left);
  },
  create: function() {
    capitalIcons = [];
    phaser.add.sprite(0, 0, 'map');
    capitalIcons.push(new CapitalIcon(365, (1080 - 500), 'northAmerica'));
    capitalIcons.push(new CapitalIcon(560, (1080 - 200), 'southAmerica'));
    capitalIcons.push(new CapitalIcon(1425, (1080 - 470), 'asia'));
    capitalIcons.push(new CapitalIcon(1095, (1080 - 565), 'europe'));
    capitalIcons.push(new CapitalIcon(1635, (1080 - 180), 'australia'));
    capitalIcons.push(new CapitalIcon(955, (1080 - 365), 'africa'));
  },
  update: function() {
  }
}
