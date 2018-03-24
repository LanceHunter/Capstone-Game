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

class SubIcon {
  constructor(x, y, ocean, playerID) {
    this.sprite = phaser.add.sprite(x, y, 'submarine');
    this.sprite.anchor.set(0, 1);
    this.playerID = playerID;
    this.ocean = ocean;
    this.launches = [];
    this.inventory = phaser.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);

    // some listeners
    this.sprite.events.onInputDown.add(() => {
      this.launches.push(new SubLaunch(this.playerID, {x: this.sprite.centerX, y: this.sprite.centerY}, this.ocean));
    }, this);

    this.sprite.events.onInputUp.add(() => {
      this.launches[this.launches.length - 1].launch({x: 10, y: 10});
    }, this);

    this.update();
  }

  update() {
    // if the sub's player can be in that ocean
    if (game.oceans[this.ocean].subs[this.playerID]) {
      //check for game state and update inventory accordingly
      if (game.war) {
        this.inventory.setText(game.oceans[this.ocean].subs[this.playerID].total);

        // if they are out of ammo
        if (game.oceans[this.ocean].subs[this.playerID].declared + game.oceans[this.ocean].subs[this.playerID].total <= 0) {
          this.sprite.alpha = 0.2;
          this.inventory.alpha = 0.2;
        } else {
          this.sprite.alpha = 1;
          this.inventory.alpha = 1;
        }
      } else {
        this.inventory.setText(game.oceans[this.ocean].subs[this.playerID].declared);
        // if they are out of ammo
        if (game.oceans[this.ocean].subs[this.playerID].declared <= 0) {
          this.sprite.alpha = 0.2;
          this.inventory.alpha = 0.2;
        } else {
          this.sprite.alpha = 1;
          this.inventory.alpha = 1;
        }
      }
      this.sprite.tint = colors[playerIDs.indexOf(this.playerID)];
      this.inventory.tint = colors[playerIDs.indexOf(this.playerID)];
      this.sprite.inputEnabled = true;
    } else {
      this.sprite.alpha = 0;
      this.inventory.alpha = 0;
    }
  }
}

class CapitalIcon {
  constructor(x, y, continent) {
    this.sprite = phaser.add.sprite(x, y, 'capital');
    this.sprite.anchor.set(0, 1);
    this.sprite.inputEnabled = true;
    this.continent = continent;
    
      this.hitPoints = phaser.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);
      this.hitPoints.position.x = this.sprite.centerX - (this.hitPoints.width / 2);
      this.sprite.tint = colors[playerIDs.indexOf(Object.keys(game.continents[this.continent].player)[0])];
      this.hitPoints.tint = colors[playerIDs.indexOf(Object.keys(game.continents[this.continent].player)[0])];
      this.update();
  }

  update() {
    if (game.war) {
      this.sprite.inputEnabled = true;
    }

    this.hitPoints.setText(game.continents[this.continent].hp);
    this.hitPoints.position.x = this.sprite.centerX - (this.hitPoints.width / 2);
    // if they are out of hit points
    if (game.continents[this.continent].hp <= 0) {
      this.sprite.alpha = 0.2;
      this.hitPoints.alpha = 0.2;
    } else {
      this.sprite.alpha = 1;
      this.hitPoints.alpha = 1;
    }
    this.hitPoints.setText(game.continents[this.continent].hp);
    this.hitPoints.position.x = this.sprite.centerX - (this.hitPoints.width / 2);
  }
}

class BomberIcon {
  constructor(x, y, continent) {
    this.sprite = phaser.add.sprite(x, y, 'bomber');
    this.sprite.anchor.set(0, 1);
    this.continent = continent;
    this.playerID = Object.keys(game.continents[this.continent].player)[0];
    this.continent = continent;
    this.launches = [];
    this.inventory = phaser.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);

    // some listeners
    this.sprite.events.onInputDown.add(() => {
      this.launches.push(new SubLaunch(this.playerID, {x: this.sprite.centerX, y: this.sprite.centerY}, this.ocean));
    }, this);

    this.sprite.events.onInputUp.add(() => {
      this.launches[this.launches.length - 1].launch({x: 10, y: 10});
    }, this);

    this.update();
  }

  update() {
    //check for game state and update inventory accordingly
    if (game.war) {
      this.inventory.setText(game.continents[this.continent].forces.bombers.total);
      this.inventory.position.x = this.sprite.centerX - (this.inventory.width / 2);
      this.sprite.inputEnabled = true;
      // if they are out of ammo
      if (game.continents[this.continent].forces.bombers.total <= 0) {
        this.sprite.alpha = 0.2;
        this.inventory.alpha = 0.2;
      } else {
        this.sprite.alpha = 1;
        this.inventory.alpha = 1;
      }
    } else {
      this.inventory.setText(game.continents[this.continent].forces.bombers.declared);
      this.inventory.position.x = this.sprite.centerX - (this.inventory.width / 2);
      // if they are haven't declared anything
      if (game.continents[this.continent].forces.bombers.declared <= 0) {
        this.sprite.alpha = 0.2;
        this.inventory.alpha = 0.2;
      } else {
        this.sprite.alpha = 1;
        this.inventory.alpha = 1;
      }
    }

    this.sprite.tint = colors[playerIDs.indexOf(this.playerID)];
    this.inventory.tint = colors[playerIDs.indexOf(this.playerID)];
  }
}

class MissileIcon {
  constructor(x, y, continent) {
    this.continent = continent
    this.playerID = Object.keys(game.continents[this.continent].player)[0];
    this.sprite = phaser.add.sprite(x, y, 'missile');
    this.sprite.anchor.set(0, 1);
    this.sprite.tint = colors[playerIDs.indexOf(this.playerID)];
    this.continent = continent;
    this.launches = [];
    this.inventory = phaser.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);
    this.inventory.tint = colors[playerIDs.indexOf(this.playerID)];

    // some listeners
    this.sprite.events.onInputDown.add(() => {
      this.launches.push(new SubLaunch(this.playerID, {x: this.sprite.centerX, y: this.sprite.centerY}, this.ocean));
    }, this);

    this.sprite.events.onInputUp.add(() => {
      this.launches[this.launches.length - 1].launch({x: 10, y: 10});
    }, this);

    this.update();
  }

  update() {
    //check for game state and update inventory accordingly
    if (game.war) {
      this.inventory.setText(game.continents[this.continent].forces.icbms.total);
      this.inventory.position.x = this.sprite.centerX - (this.inventory.width / 2);
      this.sprite.inputEnabled = true;

      // if they are out of ammo
      if (game.continents[this.continent].forces.icbms.total <= 0) {
        this.sprite.alpha = 0.2;
        this.inventory.alpha = 0.2;
      } else {
        this.sprite.alpha = 1;
        this.inventory.alpha = 1;
      }
    } else {
      this.inventory.setText(game.continents[this.continent].forces.icbms.declared);
      this.inventory.position.x = this.sprite.centerX - (this.inventory.width / 2);

      // if they are out of ammo
      if (game.continents[this.continent].forces.icbms.declared <= 0) {
        this.sprite.alpha = 0.2;
        this.inventory.alpha = 0.2;
      } else {
        this.sprite.alpha = 1;
        this.inventory.alpha = 1;
      }
    }


  }
}

class SubLaunch {
  // these will be created whenever a players's sub-deploy thing is activated
  constructor(playerID, origin, ocean) {
    // grab our attributes
    this.playerID = playerID;
    this.origin = {x: origin.x, y: origin.y};
    this.ocean = ocean;

    // set up the origin indicator, doesn't move
    if (game.oceans[this.ocean].subs[this.playerID].declared + game.oceans[this.ocean].subs[this.playerID].declared > 0) {
      this.originIndicator = phaser.add.sprite(this.origin.x, this.origin.y, 'circle');
      this.originIndicator.tint = colors[playerIDs.indexOf(playerID)];
      this.originIndicator.anchor.set(0.5);

      // set up the target indicator, follows the mouse/pointer
      this.targetIndicator = phaser.add.sprite(origin.x, origin.y, 'circle');
      this.targetIndicator.position = phaser.input.mousePointer.position;
      this.targetIndicator.tint = colors[playerIDs.indexOf(playerID)];
      this.targetIndicator.anchor.set(0.5);

      // some fake stuff for animations that don't exist yet
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

    this.targetIndicator.scale.set((Math.sin(theta) + 2) / 5);
    this.targetIndicator.alpha = (Math.sin(theta + Math.PI) + 2) / 3;
  }

  // when user releases drag on a destination
  launch(destination) {
    // check if the destination is valid first
    this.state = 'countdown';
    this.originIndicator.destroy();

    this.targetIndicator.position = {x: phaser.input.mousePointer.position.x, y: phaser.input.mousePointer.position.y};

    // set up the countdown indicator
    // this.countdownIndicator = phaser.add.sprite(origin.x, origin.y, 'circle');
    // this.countdownIndicator.tint = player.color;
    // this.countdownIndicator.anchor.set(0.5);
    // this.countdownIndicator.position = this.origin;
  }

  // after a destination is verified, start the countdown
  countdown() {
    let theta = (this.frame / 15)
    // figure out which of the launch points to use
    // start the countdown clock and animation
    // when the countdown is over, this.state = 'enroute'
    if (this.count > this.delay * 60) {
      this.state = 'enroute';
    } else {
      this.count++;
      // continue countdown animation
      this.targetIndicator.scale.set((Math.sin(theta) + 2) / 5);
      this.targetIndicator.alpha = (Math.sin(theta + Math.PI) + 2) / 3;
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
