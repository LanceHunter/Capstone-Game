// set board dimentions
let boardWidth = window.innerWidth * .8;
let boardHeight = window.innerHeight * .8;

/*
  Creates a translator object which maps coordinates from the camera to coortinates on the display. Initialize with two coordinates from the camera along with where they should be mapped to on the display.
*/
function Translator(cameraA, cameraB, displayA, displayB) {
  this.stretchX = Math.abs(displayB[0] - displayA[0]) / Math.abs(cameraB[0] - cameraA[0]) || 0;
  this.stretchY = Math.abs(displayB[1] - displayA[1]) / Math.abs(cameraB[1] - cameraA[1]) || 0;
  this.offsetX = (displayA[0] / this.stretchX) - cameraA[0] || 0;
  this.offsetY = (displayA[1] / this.stretchY) - cameraA[1] || 0;

  this.coordinates = function(coordinates) {
    let x = coordinates[0];
    let y = coordinates[1];

    x = (x + this.offsetX) * this.stretchX;
    y = (y + this.offsetY) * this.stretchY;

    return [x, y];
  }

  this.width = function(width) {
    return width * this.stretchX;
  }

  this.height = function(height) {
    return height * this.stretchY;
  }
}
/*
  Creates a target object to keep track of the last seen location of a target.
*/
function Target() {
  this.cords = null;
  this.isSet = false;
  this.updated = new Date();

  this.setPosition =function(cords) {
    currentDate = new Date();
    if (cords) {
      this.cords = cords;
      this.updated = currentDate;
    } else if (currentDate - this.updated > 500) {
      this.cords = null;
    }
  }
}

// helper function so laser target can be in hex
function hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// test of the pointer functionality, should be repaced with running the actual game
function testPointer(ctx, translator, translated) {


  ctx.beginPath();
  ctx.strokeStyle = "#00F";
  ctx.rect(translated[0], translated[1], translated[2], translated[3]);
  ctx.stroke();

  // set up laser pointer tracker
  let greenLaserColor = hexToRGB("#7ebe86");
  let greenTarget = new Target();
  console.log('green:', greenLaserColor);
  let greenTracer = "#044";
  tracking.ColorTracker.registerColor('green', (r, g, b) => {
    return (
      r < greenLaserColor.r * 1.1 && r > greenLaserColor.r * .9 &&
      g < greenLaserColor.g * 1.1 && g > greenLaserColor.g * .9 &&
      b < greenLaserColor.b * 1.1 && b > greenLaserColor.b * .9
    );
  });
  let redLaserColor = hexToRGB("#dcaaaa");
  let redTarget = new Target();
  console.log('red:', redLaserColor);
  let redTracer = "#404";
  tracking.ColorTracker.registerColor('red', (r, g, b) => {
    return (
      r < redLaserColor.r * 1.1 && r > redLaserColor.r * .9 &&
      g < redLaserColor.g * 1.1 && g > redLaserColor.g * .9 &&
      b < redLaserColor.b * 1.1 && b > redLaserColor.b * .9
    );
  });
  let tracker = new tracking.ColorTracker(['green', 'red']);
  let trackerTask = tracking.track('#video', tracker, { camera: true });

  tracker.on('track', function(event) {
    console.log(event.data.length);
    if (event.data.length > 0) {
      event.data.forEach((rect) => {
        let [x, y] = translator.coordinates([rect.x - rect.width / 2, rect.y - rect.height / 2]);

        switch (rect.color) {
          case 'green' :
            greenTarget.setPosition([x, y]);
            redTarget.setPosition();
            break;
          case 'red' :
            redTarget.setPosition([x, y]);
            greenTarget.setPosition();
            break;
        };
      })
    } else {
      redTarget.setPosition();
      greenTarget.setPosition();
    }

    ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
    ctx.beginPath()

    if (redTarget.cords) {
      ctx.fillStyle = redTracer;
      ctx.fillRect(...redTarget.cords, 10, 10);
    }
    if (greenTarget.cords) {
      ctx.fillStyle = greenTracer;
      ctx.fillRect(...greenTarget.cords, 10, 10);
    }

    ctx.rect(translated[0], translated[1], translated[2], translated[3]);
    ctx.stroke();
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
      let [translatedX, translatedY] = translator.coordinates([rect.x, rect.y]);
      let translatedWidth = translator.width(rect.width);
      let translatedHeight = translator.height(rect.height);
      ctx.beginPath()
      ctx.strokeStyle = translatedColor;
      ctx.rect(translatedX, translatedY, translatedWidth, translatedHeight);
      ctx.stroke();

      setTimeout(function() {
        if (!gameRunning) {
          gameRunning = true;
          testPointer(ctx, translator, [boardX, boardY, boardWidth, boardHeight]);
        }
        trackerTask.stop();
      }, 0);
    }
  });
}

align(boardWidth, boardHeight);
