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

// test of the pointer functionality, should be repaced with running the actual game
function testPointer(ctx, translator, translated) {
  ctx.beginPath();
  ctx.strokeStyle = "#0F0";
  ctx.rect(translated[0], translated[1], translated[2], translated[3]);
  ctx.stroke();

  // set up laser pointer tracker
  let laserColor = "#00F";
  tracking.ColorTracker.registerColor('laser', (r, g, b) => {
    return (r > 120 && g > 150 && b < 210);
  });
  let tracker = new tracking.ColorTracker(['laser']);
  let trackerTask = tracking.track('#video', tracker, { camera: true });

  tracker.on('track', function(event) {
    if (event.data.length > 0) {
      let rect = event.data[0];
      let [x, y] = translator.coordinates([rect.x - rect.width / 2, rect.y - rect.height / 2]);
      let width = translator.width(rect.width);
      let height = translator.height(rect.height);
      ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
      ctx.beginPath()
      ctx.fillStyle = laserColor;
      ctx.strokeStyle = "#0F0";
      ctx.fillRect(x, y, width, height);
      ctx.rect(translated[0], translated[1], translated[2], translated[3]);
      ctx.stroke();
    }
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
  let translatedColor = "#0F0";
  let finishedRoughAlign = true;

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
      // ctx.beginPath()
      // ctx.strokeStyle = cameraColor;
      // ctx.rect(rect.x, rect.y, rect.width, rect.height);
      // ctx.stroke();

      // draw board as translated from camera
      // let [translatedX, translatedY] = translator.coordinates([rect.x, rect.y]);
      // let translatedWidth = translator.width(rect.width);
      // let translatedHeight = translator.height(rect.height);
      // ctx.beginPath()
      // ctx.strokeStyle = translatedColor;
      // ctx.rect(translatedX, translatedY, translatedWidth, translatedHeight);
      // ctx.stroke();

      setTimeout(function() {
        testPointer(ctx, translator, [boardX, boardY, boardWidth, boardHeight]);
        trackerTask.stop();
      }, 0);
    }
  });
}

align(boardWidth, boardHeight);
