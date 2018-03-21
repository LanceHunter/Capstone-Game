// we need a game object
let game;

/*
firebase setup
*/
const database = firebase.database();


/*
set up the firebase bind
*/
$.post('/api/pregame/setup', function(data) {
  console.log('recieved:', data);
  let gameID = data.gameID;
  let gameRef = database.ref('gameInstance').child(gameID);

  console.log('setting firebase listener');
  gameRef.on('value', onGameChange).then(() => {console.log('then')});
});

/*
the callback for the on('value') call
*/
function onGameChange(data) {
  console.log('recieved object:', data.val());
  game = data.val();
  console.log('set game', game);
}

/*
give the game object a convincing wartime state*.

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
  add icons
  */
  // Pacific
  subIcons.push(new SubIcon(130, (1080 - 310), 'pacific'));
  subIcons.push(new SubIcon(175, (1080 - 215), 'pacific'));
  subIcons.push(new SubIcon(220, (1080 - 120), 'pacific'));

  // Atlantic
  subIcons.push(new SubIcon(625, (1080 - 435), 'atlantic'));
  subIcons.push(new SubIcon(690, (1080 - 330), 'atlantic'));
  subIcons.push(new SubIcon(755, (1080 - 225), 'atlantic'));

  // Indian
  subIcons.push(new SubIcon(1250, (1080 - 265), 'indian'));
  subIcons.push(new SubIcon(1250, (1080 - 180), 'indian'));
  subIcons.push(new SubIcon(1250, (1080 - 95), 'indian'));

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
