// set variables for tracking program
let minDistSq = Math.pow(30, 2);
let maxTime = 1000;
let redTargetColor = "#dcaaaa";
let greenTargetColor = "#7ebe86";
let blueTargetColor = "#7373e6";
let boardMinBrightness = 0;
let boardMaxBrightness = 90;

// create the global lasers object used by the game as pointers
const lasers = [null, null, null];

// start the phaser game
function startGame(gameID) {
  console.log('started game:', gameID);
}

/*
phaser setup
*/

let alignState = {
  preload: function() {
    this.game.load.image('map', '/board/assets/map.png');
    this.game.load.image('circle', '/board/assets/circle.png');
  },
  create: function() {
    this.game.add.sprite(0, 0, 'map');

    this.red = this.game.add.sprite(0, 0, 'circle');
    this.green = this.game.add.sprite(0, 0, 'circle');
    this.blue = this.game.add.sprite(0, 0, 'circle');

    this.red.tint = 0xdcaaa;
    this.green.tint = 0x7ebe86;
    this.blue.tint = 0x7373e6;

    this.red.scale.set(0.2);
    this.green.scale.set(0.2);
    this.blue.scale.set(0.2);
  },
  update: function() {
    if (lasers[0]) {
      this.red.position.x = lasers[0].x;
      this.red.position.y = lasers[0].y;
    }
    if (lasers[1]) {
      this.green.position.x = lasers[1].x;
      this.green.position.y = lasers[1].y;
    }
    if (lasers[2]) {
      this.blue.position.x = lasers[2].x;
      this.blue.position.y = lasers[2].y;
    }
  }
}

/*
  Creates a new game instance and shows the join game modal.
*/

const joinGameModal = new Vue({
  el: '#joinGameModal',
  data: {
    gameID: null,
    usernames: [],
  }
})

async function joinGame() {
  console.log('lauched join game');
  // create a game instance
  const database = firebase.database();
  const data = await $.post('/api/pregame/setup');
  const gameID = data.gameID;
  joinGameModal.gameID = gameID;
  const gameRef = database.ref('gameInstance').child(data.gameID);
  let usernames = [];
  gameRef.on('value', function(snapshot) {
    let gameObj = snapshot.val();
    if (gameObj.players) {
      usernames = Object.keys(gameObj.players);
      joinGameModal.usernames = usernames;
    }
  });

  // display join game modal
  const modal = document.getElementById("joinGameModal");
  modal.style.visibility = "visible";

  // start game on button press
  const beginGameButton = document.getElementById("beginGameButton");
  beginGameButton.addEventListener('click', async function() {
    if (usernames.length > 1) {
      gameRef.off();
      document.getElementById("joinGameModal").remove();
      // await $.post('/api/pregame/startgame', {gameID: gameID});
      startGame(gameID);
    }
  });
}

/*
  Creates a translator object which maps coordinates from the camera to coortinates on the display. Initialize with two coordinates from the camera along with where they should be mapped to on the display.
*/
function Translator(cameraA, cameraB, displayA, displayB) {
  this.stretchX = Math.abs(displayB[0] - displayA[0]) / Math.abs(cameraB[0] - cameraA[0]) || 0;
  this.stretchY = Math.abs(displayB[1] - displayA[1]) / Math.abs(cameraB[1] - cameraA[1]) || 0;
  this.offsetX = (displayA[0] / this.stretchX) - cameraA[0] || 0;
  this.offsetY = (displayA[1] / this.stretchY) - cameraA[1] || 0;

  this.coordinates = function(coordinates) {
    let x = coordinates.x;
    let y = coordinates.y;

    x = (x + this.offsetX) * this.stretchX;
    y = (y + this.offsetY) * this.stretchY;

    return {x, y};
  }

  this.width = function(width) {
    return width * this.stretchX;
  }

  this.height = function(height) {
    return height * this.stretchY;
  }
}

// helper function so laser halo color can be in hex
function hexToRGB(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

/*
  Creates a pointer object to keep track of the last seen location of a laser pointer.
*/
function Pointer(color) {
  this.center = null;
  this.halo = null;
  this.haloColor = hexToRGB(color);
  this.updated = new Date();

  this.range = function(r,g,b) {
    return (
      r < this.haloColor.r * 1.1 && r > this.haloColor.r * .9 &&
      g < this.haloColor.g * 1.1 && g > this.haloColor.g * .9 &&
      b < this.haloColor.b * 1.1 && b > this.haloColor.b * .9
    );
  }

  this.setPosition = function(center) {
    currentDate = new Date();
    if (center) {
      this.center = center;
      this.updated = currentDate;
    } else if (currentDate - this.updated > maxTime) {
      this.halo = null;
      this.center = null;
    }
  }
}

// finds the distance between tracking rect and a pointer object
function distanceSquared(rect, pointer) {
  let haloDistSq = pointer.halo ? Math.pow(rect.center.x - pointer.halo.x, 2) + Math.pow(rect.center.y - pointer.halo.y, 2) : Infinity;
  let centerDistSq = pointer.center ? Math.pow(rect.center.x - pointer.center.x, 2) + Math.pow(rect.center.y - pointer.center.y, 2) : Infinity;

  return Math.min(haloDistSq, centerDistSq);
}

/*
  this function uses the translator object set up in align to map the locations of the players laser pointers
  onto the game board. It does this by keepign track of three 'pointer' objects that have a location for their
  center ('which is white regardless of which laser pointer is used') and thier halo ('which is set at the top of this file as a target color'). It uses the last seen location of each pointer and it's halo to determin which white dot coresponds to which color laser pointer. It then writes that pointer location data to the global 'lasers' array for use in the game function.
*/
function trackLasers(translator) {
  console.log('tracking lasers');
  // set up the pointer objects
  let redPointer = new Pointer(redTargetColor);
  tracking.ColorTracker.registerColor('red', (r,g,b) => redPointer.range(r,g,b));
  let greenPointer = new Pointer(greenTargetColor);
  tracking.ColorTracker.registerColor('green', (r,g,b) => greenPointer.range(r,g,b));
  let bluePointer = new Pointer(blueTargetColor);
  tracking.ColorTracker.registerColor('blue', (r,g,b) => bluePointer.range(r,g,b));
  let whiteTarget = hexToRGB("#dddddd");
  tracking.ColorTracker.registerColor('white', function(r,g,b) {
    return (
      r < whiteTarget.r * 1.1 && r > whiteTarget.r * .9 &&
      g < whiteTarget.g * 1.1 && g > whiteTarget.g * .9 &&
      b < whiteTarget.b * 1.1 && b > whiteTarget.b * .9
    );
  })

  let tracker = new tracking.ColorTracker(['green', 'red', 'blue', 'white']);
  let trackerTask = tracking.track('#tracking-video', tracker, { camera: true });

  tracker.on('track', function(event) {
    event.data.forEach((rect) => {
      rect.center = translator.coordinates({x: rect.x - rect.width / 2, y: rect.y - rect.height / 2});

      switch (rect.color) {
        case 'red' :
          redPointer.halo = rect.center;
          break;
        case 'green' :
          greenPointer.halo = rect.center;
          break;
        case 'blue' :
          bluePointer.halo = rect.center;
          break;
        case 'white' :
          let candidates = [
            {
              pointer: redPointer,
              distSq: distanceSquared(rect, redPointer),
            },
            {
              pointer: greenPointer,
              distSq: distanceSquared(rect, greenPointer),
            },
            {
              pointer: bluePointer,
              distSq: distanceSquared(rect, bluePointer),
            },
          ];
          let nearest = candidates.reduce((closest, pointer) => {
            return closest.distSq < pointer.distSq ? closest : pointer;
          });

          if (nearest.distSq < minDistSq) {
            nearest.pointer.setPosition(rect.center);
          };
          break;
      };
    });

    redPointer.setPosition();
    greenPointer.setPosition();
    bluePointer.setPosition();

    lasers[0] = redPointer.center;
    lasers[1] = greenPointer.center;
    lasers[2] = bluePointer.center;
  });
}

/*
  Creates a board on the display with given width and height, detects that rectangle with the camera, and then creates a translator object that maps coordinates from the camera to coordinates on the display. Pass the translator object to the next function that needs it in the setTimeout function at the bottom (right now that is set to testPointer).
*/
function align(boardWidth, boardHeight) {
  console.log('starting alignment');
  // set up board and colors
  let state = 'rough';

  // set rough alignment settings, point camera at display
  document.getElementById("tracking-video").style.visibility = "visible";
  window.addEventListener("keypress", finishRoughAlign);

  // reset rough alighnment settings, finish alignment
  function finishRoughAlign() {
    document.getElementById("tracking-video").style.visibility = "hidden";
    window.removeEventListener("keypress", finishRoughAlign);
    state = 'precise';
  }

  // set tracker to detect the board
  tracking.ColorTracker.registerColor('board', (r, g, b) => {
    return (
      boardMinBrightness < r && r < boardMaxBrightness &&
      boardMinBrightness < g && g < boardMaxBrightness &&
      boardMinBrightness < b && b < boardMaxBrightness
    );
  });
  let boardTracker = new tracking.ColorTracker(['board']);
  let boardTrackerTask = tracking.track('#tracking-video', boardTracker, { camera: true });

  // create the translator on board detection
  boardTracker.on('track', function(event) {
    if (state === 'precise' && event.data.length > 0) {
      let rect = event.data[0];

      // create coordinate pairs for camera and display
      let cameraA = {x: rect.x, y: rect.y};
      let cameraB = {x: rect.x + rect.width, y: rect.y + rect.height};
      let boardA = {x: 0, y: 0};
      let boardB = {x: 1920, y: 1080};
      // create translator object
      let translator = new Translator(cameraA, cameraB, boardA, boardB);

      setTimeout(function() {
        if (state === 'precise') {
          console.log('finishied alignment');
          state = 'finished';
          trackLasers(translator);
          joinGame();
        }
        boardTrackerTask.stop();
      }, 0);
    }
  });
}

align();
