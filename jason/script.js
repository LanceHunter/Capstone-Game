/*
phaser setup
written for phaser-ce 2.10.1
*/

let height = 500;
let width = height * (16 / 9);
const game = new Phaser.Game(width, height, Phaser.AUTO, '', {preload: preload, create: create, update: update});

let gameObjects = {};

function preload() {
  console.log('preload');
  game.load.image('peaceMap', '/assets/peaceMap.png');
  game.load.image('warMap', '/assets/warMap.png');
  game.load.image('fireball', '/assets/ball.png');
  game.load.image('spot', '/assets/spot.png');
}

function create() {
  /*
  create and scale the map sprites
  */
  gameObjects.peaceMap = game.add.sprite(0, 0, 'peaceMap');
  gameObjects.warMap = game.add.sprite(0, 0, 'warMap');
  const xScale = game.canvas.width / gameObjects.peaceMap.width;
  const yScale = game.canvas.height / gameObjects.peaceMap.height;
  gameObjects.warMap.scale.setTo(xScale, yScale);
  gameObjects.peaceMap.scale.setTo(xScale, yScale);

  /*
  create the fireball
  */
  gameObjects.fireball = game.add.sprite(0,0, 'fireball');
  gameObjects.fireball.anchor.x = 0.5;
  gameObjects.fireball.anchor.y = 0.5;
  gameObjects.fireball.scale.x = 0.2;
  gameObjects.fireball.scale.y = 0.2;
  gameObjects.fireball.alpha = 0;

  /*
  other little points
  */
  gameObjects.startPoint = game.add.sprite(0, 0, 'spot');
  gameObjects.startPoint.anchor.x = 0.5;
  gameObjects.startPoint.anchor.y = 0.5;
  gameObjects.startPoint.scale.x = 0.2;
  gameObjects.startPoint.scale.y = 0.2;
  gameObjects.startPoint.alpha = 0;


  /*
  input listeners
  */
  game.input.onDown.add((e) => {
    gameObjects.startPoint.alpha = 1;
    gameObjects.fireball.alpha = 0.4;
    gameObjects.startPoint.position.x = e.position.x;
    gameObjects.startPoint.position.y = e.position.y;
  });
  game.input.onUp.add((e) => {
    gameObjects.fireball.alpha = 1;
    gameObjects.fireball.position.x = e.position.x;
    gameObjects.fireball.position.y = e.position.y;
  });
}

function update() {
  if (game.input.mousePointer.isDown) {
    gameObjects.fireball.position.x = game.input.mousePointer.position.x;
    gameObjects.fireball.position.y = game.input.mousePointer.position.y;
  }
}
