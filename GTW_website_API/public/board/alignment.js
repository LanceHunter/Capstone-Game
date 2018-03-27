/*
  Creates a new game instance and shows the join game modal.
*/

const joinGameModal = new Vue({
  el: '#joinGameModal',
  data: {
    colors: colors.map(c => 'rgb(' + [(c & 0xff0000) >> 16,  (c & 0x00ff00) >> 8,  (c & 0x0000ff)] + ')'),
    gameID: null,
    usernames: [],
  }
})

async function joinGame() {
  console.log('lauched join game');
  // create a game instance
  const database = firebase.database();

  /*
<<<<<<< Updated upstream
  THE REAL STUFF
  const data = await $.post('/api/pregame/setup');
  gameID = data.gameID;
  */

  // short circuit
  gameID = 'testgame0'
=======
  const data = await $.post('/api/pregame/setup');
  gameID = data.gameID;
  */
>>>>>>> Stashed changes

  // TEST GAME
  gameID = 'testgame0';

  console.log('gameID:', gameID);
  joinGameModal.gameID = gameID;
  const gameRef = database.ref('gameInstance').child(gameID);
  let usernames = [];
  gameRef.on('value', function(snapshot) {
    game = snapshot.val();
    if (game.players) {
      usernames = Object.keys(game.players);
      joinGameModal.usernames = usernames;
    }
  });

  // display join game modal
  const modal = document.getElementById("joinGameModal");
  modal.style.visibility = "visible";

  // start game on button press
  const beginGameButton = document.getElementById("beginGameButton");
  beginGameButton.addEventListener('click', async function() {
    console.log('clicked button');
    if (usernames.length > 1) {
      gameRef.off();
      document.getElementById("joinGameModal").remove();
      await $.post('/api/pregame/startgame', {gameID: gameID});
      startGame(gameRef);
    }
  });
}

/*
  Creates a translator object which maps coordinates from the camera to coortinates on the display. Initialize with two coordinates from the camera along with where they should be mapped to on the display.
*/
function Translator(cameraA, cameraB, displayA, displayB) {
  this.stretchX = Math.abs(displayB.x - displayA.x) / Math.abs(cameraB.x - cameraA.x) || 0;
  this.stretchY = Math.abs(displayB.y - displayA.y) / Math.abs(cameraB.y - cameraA.y) || 0;
  this.offsetX = (displayA.x / this.stretchX) - cameraA.x || 0;
  this.offsetY = (displayA.y / this.stretchY) - cameraA.y || 0;

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
      r < this.haloColor.r * 1.2 && r > this.haloColor.r * .8 &&
      g < this.haloColor.g * 1.2 && g > this.haloColor.g * .8 &&
      b < this.haloColor.b * 1.2 && b > this.haloColor.b * .8
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
  let trackerTask = tracking.track('#trackingVideo', tracker, { camera: true });

  tracker.on('track', function(event) {
    // console.log('red:', lasers[0]);
    // console.log('gree:', lasers[2]);
    // console.log('blue:', lasers[3]);
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
  // set up board
  let state = 'rough';
  let c = document.getElementById("alignmentCanvas");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  let ctx = c.getContext("2d");
  ctx.beginPath()
  ctx.fillStyle = "#FFF";
  console.log('drawing rect');
  ctx.fillRect((c.width - boardWidth) / 2, (c.height - boardHeight) / 2, boardWidth, boardHeight);
  ctx.stroke();

  // set rough alignment settings, point camera at display
  document.getElementById("trackingVideo").style.visibility = "visible";
  window.addEventListener("keypress", finishRoughAlign);

  // reset rough alighnment settings, finish alignment
  function finishRoughAlign() {
    document.getElementById("trackingVideo").style.visibility = "hidden";
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
  let boardTrackerTask = tracking.track('#trackingVideo', boardTracker, { camera: true });

  // create the translator on board detection
  boardTracker.on('track', function(event) {
    if (state === 'precise' && event.data.length > 0) {
      let rect = event.data[0];

      // create coordinate pairs for camera and display
      let cameraA = {x: rect.x, y: rect.y};
      let cameraB = {x: rect.x + rect.width, y: rect.y + rect.height};
      let boardA = {x: 0, y: 0};
      let boardB = {x: boardWidth, y: boardHeight};
      // create translator object
      let translator = new Translator(cameraA, cameraB, boardA, boardB);

      setTimeout(function() {
        if (state === 'precise') {
          ctx.clearRect(0, 0, c.width, c.height);
          // ctx.beginPath()
          // ctx.strokeStyle = "#F00";
          // ctx.rect(rect.x, rect.y, rect.width, rect.height);
          // ctx.stroke();
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

align(boardWidth, boardHeight);
