/*
Liquid Controller
*/
window.onload = function() {
  /*
  add pixles
  */
  let board = document.getElementById('board');

  for (let i = 0; i < 32; i++) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const pixle = document.createElement('div');
    pixle.className = 'pixle';
    pixle.id = `r${row}c${col}`;
    board.appendChild(pixle);
  }

  let zombie = new Zombie();
  runGame();

  /*
  Set up some colors
  */
  tracking.ColorTracker.registerColor('lazer', (r, g, b) => {
    return (r > 200 && g > 200 && b < 210);
  });
  // tracking.ColorTracker.registerColor('green', (r, g, b) => {
  //   return (r < 120 && g > 110 && b < 100);
  // });
  // tracking.ColorTracker.registerColor('red', (r, g, b) => {
  //   return (r > 100 && g < 75 && b < 75);
  // });
  var tracker = new tracking.ColorTracker(['lazer']);
  tracking.track('#video', tracker, { camera: true });

  let lazer = {
    x: 0,
    y: 0,
    on: false,
    target: "r0c0"
  }
  /*
  Color Tracker Handler
  */
  tracker.on('track', function(event) {
    if (event.data.length > 0) {
      event.data.forEach(function(rect) {
        let x = (rect.x + rect.width / 2);
        let y = (rect.y + rect.width / 2);

        lazer.on = true;
        lazer.x = Math.floor((x/board.offsetWidth) * 8);
        lazer.y = Math.floor((y/board.offsetHeight) * 4.5);
        if (typeof zombie != 'undefined') {
          checkHit();
        } else {
          drawBlue(x, y);
        }
        console.log('lazer at:', lazer.x, lazer.y);
      });
    } else {
      lazer.on = false;
    }
  });

  function checkHit() {
    let prev = document.getElementById(lazer.target);
    prev.classList.remove("painted");
    targetID = `r${lazer.y}c${lazer.x}`;
    let target = document.getElementById(targetID);
    if (target) {
      if(target.classList.contains('enemy')) {
        zombie.destroyed = true;
        target.classList.remove('enemy');
        target.classList.add('remains');
        zombie = new Zombie();
        move(zombie);
      } else {
        // target.classList.add("painted");
      }
      lazer.target = targetID;
    }
  }

  function Zombie() {
    this.x = Math.floor(Math.random() * 8);
    this.y = Math.floor(Math.random() * 4);
    this.destroyed = false;
    console.log('new zombie');
  }

  function runGame() {
    move(zombie);
  }

  function move(zombie) {
    if(zombie.destroyed) {
      return;
    }
    let deltaX = Math.floor(Math.random() * 3 - 1);
    let deltaY = Math.floor(Math.random() * 3 - 1);
    let prev = document.getElementById(`r${zombie.y}c${zombie.x}`);
    console.log('start:', zombie.x, zombie.y);
    console.log('delta:', deltaX, deltaY);
    if (zombie.y + deltaY < 0) {
      console.log('delta y too small');
      deltaY = 1;
    } else if (zombie.y + deltaY > 3) {
      console.log('delta y too big');
      deltaY = -1;
    }
    if (zombie.x + deltaX < 0) {
      console.log('delta x too small');
      deltaX = 1;
    }
    if (zombie.x + deltaX > 7) {
      console.log('delta x too big');
      deltaX = -1;
    }
    console.log(`r${zombie.y + deltaY}c${zombie.x + deltaX}`);
    let next = document.getElementById(`r${zombie.y + deltaY}c${zombie.x + deltaX}`);
    if (!next.classList.contains('remains')) {
      zombie.x += deltaX;
      zombie.y += deltaY;
      console.log('removing');
      prev.classList.remove('enemy');
      next.classList.add('enemy');
    }
    setTimeout(function() {move(zombie)}, 1000);
  }


}
