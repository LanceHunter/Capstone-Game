/*
phaser setup
written for phaser-ce 2.10.1
*/

/*
game specific stuff
*/
class SubLaunch {
  constructor(player, ocean, destination) {
    this.player = player;
    this.ocean = ocean;
    if (ocean.subs[player.name].total > 0) {
      // this is a fake enroute counter
      this.enrouteCount = 0;
      this.explodingCount = 0;
      this.count = 0;
      this.delay = 3;
      this.state = 'countdown';
    } else {
      this.state = 'impossible';
    }
  }

  update() {
    this[this.state]();
  }

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

let launches = [];
let newLaunch = new SubLaunch(nukeGame.players[0], nukeGame.oceans[0]);
console.log(newLaunch);
newLaunch = new SubLaunch(nukeGame.players[1], nukeGame.oceans[0]);
console.log(newLaunch);
launches.push(newLaunch);

class BomberLaunch {
  constructor(continent) {

  }
}

class ICBMLaunch {
  constructor(continent) {

  }
}

/*
phaser setup
*/
const width = 800;
const height = width * (9 / 16);
const game = new Phaser.Game(width, height, Phaser.AUTO, '', {preload: preload, create: create, update: update});

/*
some extensions for phaser
*/
Phaser.Sprite.prototype.centerAnchor = function() {
  this.anchor.x = 0.5;
  this.anchor.y = 0.5;
};

/*
phaser methods
*/
function preload() {
  /*
  LOAD IMAGES
  */
  game.load.image('peaceMap', '/assets/peaceMap.png');
  game.load.image('missile', '/assets/missile01.png');
  game.load.image('submarine', '/assets/sub01.png');
  game.load.image('bomber', '/assets/bomber01.png');
  game.load.image('circle', '/assets/circle.png');
  game.load.image('ring', '/assets/ring.png');
}

const gameObjects = {};

function create() {
  /*
  create and scale the map sprite
  */
  let peaceMap = game.add.sprite(0, 0, 'peaceMap');
  const xScale = game.canvas.width / peaceMap.width;
  const yScale = game.canvas.height / peaceMap.height;
  peaceMap.scale.setTo(xScale, yScale);
  gameObjects.peaceMap = peaceMap;

  /*
  input listeners
  */
  game.input.onDown.add((e) => {
    let startPoint = game.add.sprite(e.position.x, e.position.y, 'ring')
    startPoint.centerAnchor();
    startPoint.position.x = e.position.x;
    startPoint.position.y = e.position.y;
  });

  game.input.onUp.add((e) => {
  });
}

function update() {
  launches.forEach(e => {
    if (e.state === 'impossible') {
      console.log('impossible');
    } else
    if (e.state === 'exploded') {
      console.log('exploded');
    } else {
      e.update();
    }
  });
}
