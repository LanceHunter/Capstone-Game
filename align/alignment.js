// set board dimentions
let boardWidth = window.innerWidth * .8;
let boardHeight = window.innerHeight * .8;

// set variables for tracking program
let minDistSq = Math.pow(30, 2);
let maxTime = 1000;
let redTargetColor = "#dcaaaa";
let greenTargetColor = "#7ebe86";
let blueTargetColor = "#7373e6";
let displayColors = ["#440000", "#004400", "#000044"];

// create the global lasers object used by the game as pointers
const lasers = [null, null, null];

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
  Creates a target object to keep track of the last seen location of a target.
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

function showLasers(ctx) {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
  ctx.beginPath()
  lasers.forEach((laser, index) => {
    if(laser) {
      console.log('printing', displayColors[index], laser);
      ctx.fillStyle = displayColors[index];
      ctx.fillRect(laser.x, laser.y, 10, 10);
    }
  })
  ctx.stroke();
  setTimeout(function() {
    showLasers(ctx);
  }, 20);
}

/*
  this function uses the translator object set up in align to map the locations of the players laser pointers
  onto the game board. It does this by keepign track of three 'pointer' objects that have a location for their
  center ('which is white regardless of which laser pointer is used') and thier halo ('which is set at the top of this file as a target color'). It uses the last seen location of each pointer and it's halo to determin which white dot coresponds to which color laser pointer. It then writes that pointer location data to the global 'lasers' array for use in the game function.
*/
function trackLasers(translator) {
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
  let trackerTask = tracking.track('#video', tracker, { camera: true });

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
    console.log('lasers:', lasers);
  });
}

/*
  Creates a board on the display with given width and height, detects that rectangle with the camera, and then creates a translator object that maps coordinates from the camera to coordinates on the display. Pass the translator object to the next function that needs it in the setTimeout function at the bottom (right now that is set to testPointer).
*/
function align(boardWidth, boardHeight) {
  // set up board and colors
  let boardX = (window.innerWidth - boardWidth) / 2;
  let boardY = (window.innerHeight - boardHeight) / 2;
  let targetColor = "#FFF";
  let cameraColor = "#F00";
  let translatedColor = "#00F";
  let finishedRoughAlign = true;
  let gameRunning = false;

  // set up canvas
  let c = document.getElementById("canvas");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  let ctx = c.getContext("2d");
  ctx.fillStyle = targetColor;
  ctx.fillRect(boardX, boardY, boardWidth, boardHeight);
  finishedRoughAlign = false;

  // set tracker to detect the board
  tracking.ColorTracker.registerColor('board', (r, g, b) => {
    return (r > 90 && g > 90 && b > 90);
  });
  let tracker = new tracking.ColorTracker(['board']);
  let trackerTask = tracking.track('#video', tracker, { camera: true });

  // reset rough alighnment settings, finish alignment
  function finishRoughAlign() {
    document.getElementById("video").style.visibility = "hidden";
    window.removeEventListener("keypress", finishRoughAlign);
    // print board on the display
    ctx.fillStyle = targetColor;
    ctx.fillRect(boardX, boardY, boardWidth, boardHeight);
    finishedRoughAlign = true;
  }

  // set rough alignment settings, point camera at display
  document.getElementById("video").style.visibility = "visible";
  window.addEventListener("keypress", finishRoughAlign);

  // create the translator on board detection
  tracker.on('track', function(event) {
    if (finishedRoughAlign && event.data.length > 0) {
      let rect = event.data[0];

      // create coordinate pairs for camera and display
      let cameraA = [rect.x, rect.y];
      let cameraB = [rect.x + rect.width, rect.y + rect.height];
      let displayA = [boardX, boardY];
      let displayB = [boardX + boardWidth, boardY + boardHeight];
      // create translator object
      let translator = new Translator(cameraA, cameraB, displayA, displayB);

      // clear canvas
      ctx.clearRect(0,0, c.width, c.height);

      // draw board
      // ctx.fillRect(boardX, boardY, boardWidth, boardHeight);

      // draw board as originally detected by camera
      ctx.beginPath()
      ctx.strokeStyle = cameraColor;
      ctx.rect(rect.x, rect.y, rect.width, rect.height);
      ctx.stroke();

      // draw board as translated from camera
      let translated = translator.coordinates(rect);
      let translatedWidth = translator.width(rect.width);
      let translatedHeight = translator.height(rect.height);
      ctx.beginPath()
      ctx.strokeStyle = translatedColor;
      ctx.rect(translated.x, translated.y, translatedWidth, translatedHeight);
      ctx.stroke();

      setTimeout(function() {
        if (!gameRunning) {
          gameRunning = true;
          console.log('started the game');
          trackLasers(translator);
          showLasers(ctx);
        }
        trackerTask.stop();
      }, 0);
    }
  });
}

align(boardWidth, boardHeight);
