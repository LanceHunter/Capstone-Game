// we need a game object
let game;

/*
firebase setup
*/
const database = firebase.database();

// a global firebase reference
let fbGame;
let gameID;

/*
set up the firebase bind
$.post('/api/pregame/setup', function(data) {
  console.log('/api/pregame/setup:', data);
  gameID = data.gameID;
  fbGame = database.ref('gameInstance').child(gameID);
  console.log('gameID', gameID);

  console.log('setting firebase listener');
  fbGame.once('value', onGameInit);
});
*/

/*
test game
*/
function testGame(gameID) {
  fbGame = database.ref('gameInstance').child(gameID);
  console.log('gameID', gameID);

  console.log('setting firebase listener');
  fbGame.once('value', onGameInit);
}

testGame('game8928');

/*
callback for game init
*/
function onGameInit(data) {
  console.log('onGameChange');
  game = data.val();
  console.log('game object:', game)
  playerIDs = Object.keys(game.players);
  for (let i = 0; i < playerIDs.length; i++) {
    game.players[playerIDs[i]].color = colors[i];
  }
  fbGame.on('value', onGameChange);
}

/*
callback for fb game changes
*/
function onGameChange(data) {
  console.log('onGameChange');
  Object.assign(game, data.val());
  console.log('game object:', game)
}

/*
phaser setup
written for phaser-ce 2.10.1
*/

// a few things that get our canvas and phaser instance ready
const width = 1920;
const height = width * (9 / 16);
const phaser = new Phaser.Game(width, height, Phaser.AUTO, '', {preload: preload, create: create, update: update});

/*
load textures
*/
function preload() {
  phaser.load.image('map', '/board/assets/map.png');
  phaser.load.image('missile', '/board/assets/missile.png');
  phaser.load.image('submarine', '/board/assets/submarine.png');
  phaser.load.image('bomber', '/board/assets/bomber.png');
  phaser.load.image('capital', '/board/assets/capital.png');
  phaser.load.image('circle', '/board/assets/circle.png');
  phaser.load.image('ring', '/board/assets/ring.png');
}

/*
create game objects
*/
function create() {
  /*
  create and scale the map sprite
  */
  let map = phaser.add.sprite(0, 0, 'map');

  /*
  sub icons
    * these indices are parallel to playerIDs
  */
  subIcons = {
    pacific : [
      new SubIcon(130, (1080 - 310), 0),
      new SubIcon(175, (1080 - 215), 1),
      new SubIcon(220, (1080 - 120), 2)
    ],
    atlantic : [
      new SubIcon(625, (1080 - 435)),
      new SubIcon(690, (1080 - 330)),
      new SubIcon(755, (1080 - 225))
    ],
    indian : [
      new SubIcon(1250, (1080 - 265)),
      new SubIcon(1250, (1080 - 180)),
      new SubIcon(1250, (1080 - 95))
    ]
  }

  // North America
  bomberIcons.push(new BomberIcon(260, (1080 - 500), 'northAmerica'));
  capitalIcons.push(new CapitalIcon(365, (1080 - 500), 'northAmerica'));
  missileIcons.push(new MissileIcon(470, (1080 - 500), 'northAmerica'));

  // South America
  bomberIcons.push(new BomberIcon(495, (1080 - 285), 'southAmerica'));
  capitalIcons.push(new CapitalIcon(560, (1080 - 200), 'southAmerica'));
  missileIcons.push(new MissileIcon(540, (1080 - 90), 'southAmerica'));

  // Asia
  bomberIcons.push(new BomberIcon(1320, (1080 - 470), 'asia'));
  capitalIcons.push(new CapitalIcon(1425, (1080 - 470), 'asia'));
  missileIcons.push(new MissileIcon(1530, (1080 - 470), 'asia'));

  // Europe
  bomberIcons.push(new BomberIcon(990, (1080 - 565), 'europe'));
  capitalIcons.push(new CapitalIcon(1095, (1080 - 565), 'europe'));
  missileIcons.push(new MissileIcon(1200, (1080 - 565), 'europe'));

  // Australia
  bomberIcons.push(new BomberIcon(1530, (1080 - 180), 'australia'));
  capitalIcons.push(new CapitalIcon(1635, (1080 - 180), 'australia'));
  missileIcons.push(new MissileIcon(1740, (1080 - 180), 'australia'));

  // Africa
  bomberIcons.push(new BomberIcon(850, (1080 - 365), 'africa'));
  capitalIcons.push(new CapitalIcon(955, (1080 - 365), 'africa'));
  missileIcons.push(new MissileIcon(1060, (1080 - 365), 'africa'));
}

/*
game loop
*/
function update() {
  /*
  set up all the launch events
  */
  subIcons.forEach(subIcon => {
    subIcon.launches.forEach(launch => {
      if (launch.state === 'impossible') {
        // show a dialog that indicates out of ammo
        console.log('impossible');
      } else
      if (launch.state === 'exploded') {
        subIcon.launches.shift();
        console.log(subIcon.launches);
      } else {
        launch.update();
      }
    });
  });
}
