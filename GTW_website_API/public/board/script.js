/*
firebase setup
*/
const database = firebase.database();
let game;

console.log('making api call');
$.post('/api/pregame/setup', function(data) {
  console.log('recived:', data);
  let gameID = data.gameID;
  let gameRef = database.ref('gameInstance').child(gameID);

  console.log('setting firebase listener');
  gameRef.on('value', function(data) {
    console.log('recived object:', data.val());
    game = data.val();
  });
});

/*
phaser setup
written for phaser-ce 2.10.1
*/

/*
game specific stuff
*/

/*
the other launch classes
class BomberLaunch {
  constructor(continent) {

  }
}

class ICBMLaunch {
  constructor(continent) {

  }
}
*/

class SubLaunch {
  // these will be created whenever a players's sub-deploy thing is activated
  constructor(player, origin) {
    // grab our attributes
    this.player = player;
    this.origin = {x: origin.x, y: origin.y};

    // set up the origin indicator
    this.originIndicator = phaser.add.sprite(this.origin.x, this.origin.y, 'circle');
    this.originIndicator.tint = player.color;
    this.originIndicator.anchor.set(0.5);

    // this is fake, it will be determined by the origin
    this.ocean = game.oceans[0];

    if (this.ocean.subs[player.name].total > 0) {
      // some fake stuff for testing
      this.enrouteCount = 0;
      this.explodingCount = 0;

      // a gear for animations
      this.frame = 0;

      // to keep track of the countdown timer
      this.delay = 3;
      this.count = 0;

      // first we start aiming
      this.state = 'aiming';
    } else {
      // or we don't have any subs
      this.state = 'impossible';
    }
  }

  // the method to call on every game loop iteration, calls a method depending on state
  update() {
    this.frame++;
    this[this.state]();
  }

  // when user is still dragging from origin to destination
  aiming() {
    let theta = (this.frame / 15)
    this.originIndicator.scale.set((Math.sin(theta) + 2) / 15);
    this.originIndicator.alpha = (Math.sin(theta + Math.PI) + 2) / 3;
  }

  // when user releases drag on a destination
  launch(destination) {
    // check if the destination is valid first
    this.state = 'countdown';
    this.originIndicator.destroy();

    // set up the countdown indicator
    this.countdownIndicator = phaser.add.sprite(origin.x, origin.y, 'circle');
    this.countdownIndicator.tint = player.color;
    this.countdownIndicator.anchor.set(0.5);
    this.countdownIndicator.position = this.origin;
  }

  // after a destination is verified, start the countdown
  countdown() {
    console.log('countdown');
    // figure out which of the launch points to use
    // start the countdown clock and animation
    // when the countdown is over, this.state = 'enroute'
    if (this.count > this.delay * 60) {
      this.state = 'enroute';
    } else {
      this.count++;
      // continue countdown animation
    }
  }

  // while the missile is traveling
  enroute() {
    // fakeit
    console.log('enroute');
    this.enrouteCount++;
    if (this.enrouteCount > 3 * 60) {
      this.state = 'exploding';
    }
    // start the launch animation
    // when it gets to the destination, this.state = 'exploding'
  }

  // while the explosion animation is happening
  exploding() {
    console.log('exploding');
    this.explodingCount++;
    if (this.explodingCount > 1 * 60) {
      this.state = 'exploded';
    }
    // when the missile gets to the destination
    // get rid of the
    // ocean.subs[player.name].total--;
    // if (ocean.subs[player.name].declared > 0) {
    //   ocean.subs[player.name].declared--;
    // }
    // when done exploding, this.state = 'exploded'
  }

}

/*
phaser setup
*/
const width = 1920;
const height = width * (9 / 16);
const phaser = new Phaser.Game(width, height, Phaser.AUTO, '', {preload: preload, create: create, update: update});

/*
phaser methods
*/
function preload() {
  /*
  LOAD IMAGES
  */
  phaser.load.image('map', '/board/assets/map.png');
  phaser.load.image('missile', '/board/assets/missile.png');
  phaser.load.image('submarine', '/board/assets/submarine.png');
  phaser.load.image('bomber', '/board/assets/bomber.png');
  phaser.load.image('capital', '/board/assets/capital.png');
  phaser.load.image('circle', '/board/assets/circle.png');
  phaser.load.image('ring', '/board/assets/ring.png');
}

let subIcons = [];
let capitalIcons = [];
let bomberIcons = [];
let missileIcons = [];

function create() {
  /*
  create and scale the map sprite
  */
  let map = phaser.add.sprite(0, 0, 'map');

  /*
  add icons
  */
  // Pacific
  subIcons.push(phaser.add.sprite(130, (1080 - 310), 'submarine').anchor.set(0, 1));
  subIcons.push(phaser.add.sprite(175, (1080 - 215), 'submarine').anchor.set(0, 1));
  subIcons.push(phaser.add.sprite(220, (1080 - 120), 'submarine').anchor.set(0, 1));

  // Atlantic
  subIcons.push(phaser.add.sprite(625, (1080 - 435), 'submarine').anchor.set(0, 1));
  subIcons.push(phaser.add.sprite(690, (1080 - 330), 'submarine').anchor.set(0, 1));
  subIcons.push(phaser.add.sprite(755, (1080 - 225), 'submarine').anchor.set(0, 1));

  // Indian
  subIcons.push(phaser.add.sprite(1250, (1080 - 265), 'submarine').anchor.set(0, 1));
  subIcons.push(phaser.add.sprite(1250, (1080 - 180), 'submarine').anchor.set(0, 1));
  subIcons.push(phaser.add.sprite(1250, (1080 - 95), 'submarine').anchor.set(0, 1));

  // North America
  bomberIcons.push(phaser.add.sprite(260, (1080 - 500), 'bomber').anchor.set(0, 1));
  capitalIcons.push(phaser.add.sprite(365, (1080 - 500), 'capital').anchor.set(0, 1));
  missileIcons.push(phaser.add.sprite(470, (1080 - 500), 'missile').anchor.set(0, 1));

  // South America
  bomberIcons.push(phaser.add.sprite(495, (1080 - 285), 'bomber').anchor.set(0, 1));
  capitalIcons.push(phaser.add.sprite(560, (1080 - 200), 'capital').anchor.set(0, 1));
  missileIcons.push(phaser.add.sprite(540, (1080 - 90), 'missile').anchor.set(0, 1));

  // Asia
  bomberIcons.push(phaser.add.sprite(1320, (1080 - 470), 'bomber').anchor.set(0, 1));
  capitalIcons.push(phaser.add.sprite(1425, (1080 - 470), 'capital').anchor.set(0, 1));
  missileIcons.push(phaser.add.sprite(1530, (1080 - 470), 'missile').anchor.set(0, 1));

  // Europe
  bomberIcons.push(phaser.add.sprite(990, (1080 - 565), 'bomber').anchor.set(0, 1));
  capitalIcons.push(phaser.add.sprite(1095, (1080 - 565), 'capital').anchor.set(0, 1));
  missileIcons.push(phaser.add.sprite(1200, (1080 - 565), 'missile').anchor.set(0, 1));

  // Australia
  bomberIcons.push(phaser.add.sprite(1530, (1080 - 180), 'bomber').anchor.set(0, 1));
  capitalIcons.push(phaser.add.sprite(1635, (1080 - 180), 'capital').anchor.set(0, 1));
  missileIcons.push(phaser.add.sprite(1740, (1080 - 180), 'missile').anchor.set(0, 1));

  // Africa
  bomberIcons.push(phaser.add.sprite(850, (1080 - 365), 'bomber').anchor.set(0, 1));
  capitalIcons.push(phaser.add.sprite(955, (1080 - 365), 'capital').anchor.set(0, 1));
  missileIcons.push(phaser.add.sprite(1060, (1080 - 365), 'missile').anchor.set(0, 1));



  /*
  input listeners
  */
  phaser.input.onDown.add((e) => {
    player.launches.push(new SubLaunch(player, e.position));
    console.log(player.launches[player.launches.length - 1].state);
  });

  phaser.input.onUp.add((e) => {
    // put the last launch in a countdown state
    if (player.launches.length > 0) {
      player.launches[player.launches.length - 1].launch();
      console.log(player.launches);
    }
  });
}

function update() {
  // handle all the launch stuff
  // players.forEach(player => {
  //   player.launches.forEach(launch => {
  //     if (launch.state === 'impossible') {
  //       // show a dialog that indicates out of ammo
  //       console.log('impossible');
  //     } else
  //     if (launch.state === 'exploded') {
  //       player.launches.shift();
  //       console.log(player.launches);
  //     } else {
  //       launch.update();
  //     }
  //   });
  // });
}
