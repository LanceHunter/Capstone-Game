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

let game;

// get some useful stuff from our game object
let players = game.players;
players.forEach(player => player.launches = []);

// set up fake player colors
players[0].color = 0xff0000;
players[1].color = 0x00ff00;
players[2].color = 0x0000ff;
players[3].color = 0xffff00;
players[4].color = 0x00ffff;
players[5].color = 0x0fff00;

let player = players[1];

// set up sub launch locations, this will eventually be the same position as the HUD
game.oceans[0].launchPosition = {x: 100, y: 100};
game.oceans[1].launchPosition = {x: 100, y: 100};
game.oceans[2].launchPosition = {x: 100, y: 100};

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


const gameObjects = {};

/*
phaser setup
*/
const width = 800;
const height = width * (9 / 16);
const phaser = new Phaser.Game(width, height, Phaser.AUTO, '', {preload: preload, create: create, update: update});

/*
phaser methods
*/
function preload() {
  /*
  LOAD IMAGES
  */
  phaser.load.image('peaceMap', '/assets/peaceMap.png');
  phaser.load.image('missile', '/assets/missile01.png');
  phaser.load.image('submarine', '/assets/sub01.png');
  phaser.load.image('bomber', '/assets/bomber01.png');
  phaser.load.image('circle', '/assets/circle.png');
  phaser.load.image('ring', '/assets/ring.png');
}

function create() {
  /*
  create and scale the map sprite
  */
  let peaceMap = phaser.add.sprite(0, 0, 'peaceMap');
  const xScale = phaser.canvas.width / peaceMap.width;
  const yScale = phaser.canvas.height / peaceMap.height;
  peaceMap.scale.setTo(xScale, yScale);
  gameObjects.peaceMap = peaceMap;

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
  players.forEach(player => {
    player.launches.forEach(launch => {
      if (launch.state === 'impossible') {
        // show a dialog that indicates out of ammo
        console.log('impossible');
      } else
      if (launch.state === 'exploded') {
        player.launches.shift();
        console.log(player.launches);
      } else {
        launch.update();
      }
    });

  });
}
