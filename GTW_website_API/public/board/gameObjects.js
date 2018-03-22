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

// globals

class SubIcon {
  constructor(x, y, ocean, player) {
    this.sprite = phaser.add.sprite(x, y, 'submarine');
    this.sprite.anchor.set(0, 1);
    this.sprite.inputEnabled = true;
    this.launches = [];
    this.sprite.tint = colors[playerIDs.indexOf(player)];
    console.log(colors[playerIDs.indexOf(player)], colors);

    this.player = player;
    this.ocean = ocean;

    this.sprite.events.onInputDown.add(() => {
      console.log(this.ocean);
      this.launches.push(new SubLaunch('fakeplayer', {x: this.sprite.centerX, y: this.sprite.centerY}));
    }, this);

    this.sprite.events.onInputUp.add(() => {
      this.launches[this.launches.length - 1].launch({x: 10, y: 10});
    }, this);

    console.log(playerIDs.indexOf(player));
  }
}

class SubLaunch {
  // these will be created whenever a players's sub-deploy thing is activated
  constructor(player, origin) {
    // grab our attributes
    this.player = player;
    this.origin = {x: origin.x, y: origin.y};

    // set up the origin indicator
    this.originIndicator = phaser.add.sprite(this.origin.x, this.origin.y, 'circle');
    this.originIndicator.tint = 0xff0000;
    this.originIndicator.anchor.set(0.5);

    // this is fake, it will be determined by the origin
    this.ocean = game.oceans[0];

    if (true) {
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
    this.originIndicator.scale.set((Math.sin(theta) + 2) / 5);
    this.originIndicator.alpha = (Math.sin(theta + Math.PI) + 2) / 3;
  }

  // when user releases drag on a destination
  launch(destination) {
    // check if the destination is valid first
    this.state = 'countdown';
    this.originIndicator.destroy();

    // set up the countdown indicator
    // this.countdownIndicator = phaser.add.sprite(origin.x, origin.y, 'circle');
    // this.countdownIndicator.tint = player.color;
    // this.countdownIndicator.anchor.set(0.5);
    // this.countdownIndicator.position = this.origin;
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

class CapitalIcon {
  constructor(x, y, continent) {
    this.sprite = phaser.add.sprite(x, y, 'capital').anchor.set(0, 1);
    this.continent = continent;
  }
}

class BomberIcon {
  constructor(x, y, continent) {
    this.sprite = phaser.add.sprite(x, y, 'bomber').anchor.set(0, 1);
    this.continent = continent;
  }
}

class MissileIcon {
  constructor(x, y, continent) {
    this.sprite = phaser.add.sprite(x, y, 'missile').anchor.set(0, 1);
    this.continent = continent;
  }
}

/*
game loop
*/
function update() {
  // handle all the launch stuff
  subIcons.forEach(subIcon => {
    subIcon.launches.forEach(launch => {
      if (launch.state === 'impossible') {
        // show a dialog that indicates out of ammo
        console.log('impossible');
      } else
      if (launch.state === 'exploded') {
        subIcon.launches.shift();
        console.log(subIcon.launches);
      } else {
        launch.update();
      }
    });
  });
}
