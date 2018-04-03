/*
TARGETS
*/
class CapitalIcon {
  constructor(x, y, continent, phaserState) {
    // our phaserState, which we add sprites and sounds to
    this.phaserState = phaserState;

    // a string key for the continent of this capital
    this.continent = continent;
    this.playerID = Object.keys(game.continents[this.continent].player)[0];

    // sprite setup
    this.sprite = this.phaserState.add.sprite(x, y, 'capital');
    this.sprite.tint = colors[playerIDs.indexOf(Object.keys(game.continents[this.continent].player)[0])];
    this.sprite.anchor.set(0, 1);
    this.sprite.inputEnabled = true;

    // game mechanics
    this.hitPoints = this.phaserState.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);
    this.hitPoints.position.x = this.sprite.centerX - (this.hitPoints.width / 2);
    this.hitPoints.tint = colors[playerIDs.indexOf(Object.keys(game.continents[this.continent].player)[0])];

    // sync up with firebase
    this.updateState();
  }

  // triggered when the firebase state changes
  updateState() {
    // make the capital active if war
    if (game.war) {
      this.sprite.inputEnabled = true;
    }

    // HP display
    this.hitPoints.setText(game.continents[this.continent].hp);
    this.hitPoints.position.x = this.sprite.centerX - (this.hitPoints.width / 2);

    // peacetime visuals
    if (game.peacetime) {
      this.sprite.alpha = peaceAlpha;
      this.hitPoints.alpha = peaceAlpha;
    } else
    //wartime visuals
    if (game.war) {
      this.sprite.alpha = liveAlpha;
      this.hitPoints.alpha = liveAlpha;
      if (game.continents[this.continent].hp <= 0) {
        this.sprite.alpha = deadAlpha;
        this.hitPoints.alpha = deadAlpha;
      }
    } else {
      // continent select visuals
      this.sprite.alpha = liveAlpha;
    }
  }

  // triggered when a capital is painted
  select(data) {
    // self replaces 'this', because the execution context changes when this is called
    let self = data.self;

    // our PlayerPointer object
    let pointer = data.pointer;

    // check that you aren't painting your own capital
    if (pointer.playerID != self.playerID) {
      // and that the capital has HP
      if (game.continents[self.continent].hp > 0) {
        // check all the weapons for armed launch objects
        subIcons.forEach((sub) => {
          if (sub.playerID === pointer.playerID) {
            if (sub.launch && sub.launch.state === 'armed') {
              sub.launch.launch(self, pointer.playerID);
            }
          }
        });
        missileIcons.forEach((missile) => {
          if (missile.playerID === pointer.playerID) {
            if (missile.launch && missile.launch.state === 'armed') {
              missile.launch.launch(self, pointer.playerID);
            }
          }
        });
        bomberIcons.forEach((bomber) => {
          if (bomber.playerID === pointer.playerID) {
            if (bomber.launch && bomber.launch.state === 'armed') {
              bomber.launch.launch(self, pointer.playerID);
            }
          }
        });
      }
    }
  }
}

/*
WEAPONS
TODO: refactor with inheritance
*/
class SubIcon {
  constructor(x, y, ocean, playerID, phaserState) {
    // where we add game objects, game state's 'this.game'
    this.phaserState = phaserState;

    // this is for the generalization of the Launch object, it handles different launches differently instead of having SubLaunch, BomberLaunch, MissileLaunch
    this.type = 'sub';

    // we need to know which ocean and player this thing exists in
    this.ocean = ocean;
    this.playerID = playerID;

    // sprite setup
    this.sprite = this.phaserState.add.sprite(x, y, 'submarine');
    this.sprite.anchor.set(0, 1);
    this.sprite.tint = colors[playerIDs.indexOf(this.playerID)];
    this.inventory = this.phaserState.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);
    this.inventory.tint = colors[playerIDs.indexOf(this.playerID)];

    // the initial grab from firebase
    this.updateState();
  }

  // called everytime the game object is changed in firebase
  updateState() {
    // can this all be one line? yes, with reduce, but it would be ugly and unreadable.
    // all of the continent names that playerID owns
    let playerContinents = Object.keys(game.players[this.playerID].continents);

    // now we build all the oceans that are available to playerID
    let availableOceans = [];
    playerContinents.forEach(continent => {
      Object.keys(game.continents[continent].oceans).forEach(ocean => {
        availableOceans.push(ocean);
      });
    });

    // if the sub's player can be in that ocean
    if (availableOceans.includes(this.ocean)) {
      //check for game state and update inventory accordingly
      if (game.war) {
        // in wartime, we enable input for the weapon sprites
        this.sprite.inputEnabled = true;

        // and display the total inventory instead of the declared, and centered
        this.inventory.setText(game.oceans[this.ocean].subs[this.playerID].total);
        this.inventory.position.x = this.sprite.centerX - (this.inventory.width / 2);

        // if they are out of ammo
        if (game.oceans[this.ocean].subs[this.playerID].total <= 0) {
          this.sprite.alpha = deadAlpha;
          this.inventory.alpha = deadAlpha;
        } else {
          // if they can shoot
          this.sprite.alpha = liveAlpha;
          this.inventory.alpha = liveAlpha;
        }
      } else {
        this.inventory.setText(game.oceans[this.ocean].subs[this.playerID].declared);
        this.inventory.position.x = this.sprite.centerX - (this.inventory.width / 2);

        // if they have nothing declared, low alpha
        if (game.oceans[this.ocean].subs[this.playerID].declared <= 0) {
          this.sprite.alpha = deadAlpha;
          this.inventory.alpha = deadAlpha;
        } else {
          // otherwise high alpha
          this.sprite.alpha = liveAlpha;
          this.inventory.alpha = liveAlpha;
        }
      }
    } else {
      // if the sub can't be there, it is completely invisible
      this.sprite.alpha = 0;
      this.inventory.alpha = 0;
    }
  }

  // called on every game loop iteration
  update() {
    // if it has a launch, update it
    if (this.launch) {
      this.launch.update();
    }
  }

  // called when any pointer is trying to select it
  select(data) {
    // self replaces the intuitive 'this' for this method
    let self = data.self;
    let pointer = data.pointer;

    // is it your sub?
    if (self.playerID === pointer.playerID) {
      // can you use that sub and do you have ammo?
      if (game.oceans[self.ocean].subs[self.playerID] && game.oceans[self.ocean].subs[self.playerID].total > 0) {
        // is there already a launch happening?
        if (!self.launch) {
          self.launch = new Launch(self, self.phaserState);
        } else {
          // console.log('there is already a launch in progress');
        }
      } else {
        // console.log('no ammo');
      }
    }
  }
}

class BomberIcon {
  constructor(x, y, continent, phaserState) {
    // where we add game objects, game state's 'this.game'
    this.phaserState = phaserState;

    // this is for the generalization of the Launch object, it handles different launches differently instead of having SubLaunch, BomberLaunch, MissileLaunch
    this.type = 'bomber';

    // we need to know about the continent and owner
    this.continent = continent;
    this.playerID = Object.keys(game.continents[this.continent].player)[0];

    // sprite setup
    this.sprite = this.phaserState.add.sprite(x, y, 'bomber');
    this.sprite.anchor.set(0, 1);
    this.sprite.tint = colors[playerIDs.indexOf(this.playerID)];
    this.inventory = this.phaserState.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);
    this.inventory.tint = colors[playerIDs.indexOf(this.playerID)];

    // the initial grab from firebase
    this.updateState();
  }

  updateState() {
    //check for game state and update inventory accordingly
    if (game.war) {
      // in wartime, we enable input for the weapon sprites
      this.sprite.inputEnabled = true;

      // and display the total inventory instead of the declared, and centered
      this.inventory.setText(game.continents[this.continent].forces.bombers.total);
      this.inventory.position.x = this.sprite.centerX - (this.inventory.width / 2);

      // if they are out of ammo
      if (game.continents[this.continent].forces.bombers.total <= 0) {
        this.sprite.alpha = deadAlpha;
        this.inventory.alpha = deadAlpha;
      } else {
        // if they can shoot
        this.sprite.alpha = liveAlpha;
        this.inventory.alpha = liveAlpha;
      }
    } else {
      // in peacetime, display the declared forces
      this.inventory.setText(game.continents[this.continent].forces.bombers.declared);
      this.inventory.position.x = this.sprite.centerX - (this.inventory.width / 2);

      // if they have nothing declared, low alpha
      if (game.continents[this.continent].forces.bombers.declared <= 0) {
        this.sprite.alpha = deadAlpha;
        this.inventory.alpha = deadAlpha;
      } else {
        // otherwise high alpha
        this.sprite.alpha = peaceAlpha;
        this.inventory.alpha = peaceAlpha;
      }
    }
  }

  // called on every game loop iteration
  update() {
    // if it has a launch, update it
    if (this.launch) {
      this.launch.update();
    }
  }

  select(data) {
    // self replaces the intuitive 'this' for this method
    let self = data.self;
    let pointer = data.pointer;

    // is it your bomber?
    if (self.playerID === pointer.playerID) {
      // do you have ammo?
      if (game.continents[self.continent].forces.bombers.total > 0) {
        // is there already a launch happening?
        if (!self.launch) {
          self.launch = new Launch(self, self.phaserState);
        } else {
          // console.log('there is already a launch in progress');
        }
      } else {
        // console.log('no ammo');
      }
    }
  }
}

class MissileIcon {
  constructor(x, y, continent, phaserState) {
    // where we add game objects, game state's 'this.game'
    this.phaserState = phaserState;

    // this is for the generalization of the Launch object, it handles different launches differently instead of having SubLaunch, BomberLaunch, MissileLaunch
    this.type="icbm";

    // we need to know about the continent and owner
    this.continent = continent
    this.playerID = Object.keys(game.continents[this.continent].player)[0];

    // sprite setup
    this.sprite = this.phaserState.add.sprite(x, y, 'missile');
    this.sprite.anchor.set(0, 1);
    this.sprite.tint = colors[playerIDs.indexOf(this.playerID)];
    this.inventory = this.phaserState.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);
    this.inventory.tint = colors[playerIDs.indexOf(this.playerID)];

    // initial grab from firebase
    this.updateState();
  }

  updateState() {
    //check for game state and update inventory accordingly
    if (game.war) {
      // in wartime, we enable input for the weapon sprites
      this.sprite.inputEnabled = true;

      // and display the total inventory instead of the declared, and centered
      this.inventory.setText(game.continents[this.continent].forces.icbms.total);
      this.inventory.position.x = this.sprite.centerX - (this.inventory.width / 2);

      // if they are out of ammo
      if (game.continents[this.continent].forces.icbms.total <= 0) {
        this.sprite.alpha = deadAlpha;
        this.inventory.alpha = deadAlpha;
      } else {
        // if they can shoot
        this.sprite.alpha = liveAlpha;
        this.inventory.alpha = liveAlpha;
      }
    } else {
      // in peacetime, display declared forces
      this.inventory.setText(game.continents[this.continent].forces.icbms.declared);
      this.inventory.position.x = this.sprite.centerX - (this.inventory.width / 2);

      // if they have nothing declared, low alpha
      if (game.continents[this.continent].forces.icbms.declared <= 0) {
        this.sprite.alpha = deadAlpha;
        this.inventory.alpha = deadAlpha;
      } else {
        // otherwise high alpha
        this.sprite.alpha = liveAlpha;
        this.inventory.alpha = liveAlpha;
      }
    }
  }

  // called every game loop iteration
  update() {
    // if it has a launch, update it
    if (this.launch) {
      this.launch.update();
    }
  }

  select(data) {
    // self replaces the intuitive 'this' for this method
    let self = data.self;
    let pointer = data.pointer;

    // is it your missile?
    if (self.playerID === pointer.playerID) {
      // do you have ammo?
      if (game.continents[self.continent].forces.icbms.total > 0) {
        // is there already a launch happening?
        if (!self.launch) {
          self.launch = new Launch(self, self.phaserState);
        } else {
          // console.log('there is already a launch in progress');
        }
      } else {
        // console.log('no ammo');
      }
    }
  }
}

/*
LAUNCH
*/
class Launch {
  // these will be created whenever a players's sub-deploy thing is activated
  constructor(origin, phaserState) {
    this.phaserState = phaserState;
    // the origin icon object
    this.origin = origin;

    // setup the origin indicator
    this.originIndicator = new TargetIndicator(this.origin.sprite, colors[playerIDs.indexOf(this.origin.playerID)], this.phaserState);

    // play the arming sound
    this.phaserState.add.audio('armbomb').play();

    // set the state to armed
    this.state = 'armed';
  }

  // on every game loop
  update() {
    // invoke the state method
    this[this.state]();
  }

  // a weapon has been selected, launch is pending
  armed() {
    // animate the originIndicator
    this.originIndicator.update();
  }

  initLaunch() {
    console.log(this.phaserState);
    // sprite stuff
    this.targetIndicator = new TargetIndicator(this.target.sprite, colors[playerIDs.indexOf(this.origin.playerID)], this.phaserState);
    this.projectile = this.phaserState.add.sprite(this.origin.sprite.centerX, this.origin.sprite.centerY, 'projectile');
    this.projectile.tint = colors[playerIDs.indexOf(this.origin.playerID)];
    this.projectile.anchor.set(0.5);
    this.projectile.alpha = liveAlpha;
    this.phaserState.add.audio('launch').play();

    this.targetCenter = new Phaser.Point(this.target.sprite.centerX, this.target.sprite.centerY);
    let velocity = 10 + (game.players[this.origin.playerID].rnd.speed * 2 / 500);
    this.projectile.velocity = Phaser.Point.subtract(this.targetCenter, this.projectile.position).normalize().multiply(velocity, velocity);
    this.projectile.rotation = Phaser.Point.angle(this.origin.sprite.position, this.target.sprite.position) - (Math.PI / 2);

    this.state = 'enroute';
    this.targetFrame = 0;
  }

  // when user paints a destination
  launch(capital, playerID) {
    if (this.state === 'armed') {
      this.target = capital;

      // check that the capital doesn't belong to the origin and isn't already dead
      if (this.target.playerID != this.origin.playerID && game.continents[this.target.continent].hp > 0) {
        if (this.origin.type === 'sub') {
          // check for valid sub launch
          if (Object.keys(game.oceans[this.origin.ocean].canHit).includes(this.target.continent)) {
            this.initLaunch();
          } else {
            //console.log('invalid sub');
          }
        } else
        if (this.origin.type === 'bomber') {
          // check for valid bomber launch
          if (game.continents[this.origin.continent].distances[this.target.continent] <= 1) {
            this.initLaunch();
          } else {
            // console.log('invalid bomb');
          }
        } else {
          this.initLaunch();
        }
      }
    }
  }

  // while the missile is traveling
  enroute() {
    this.originIndicator.update();
    this.targetIndicator.update();

    this.projectile.position.add(this.projectile.velocity.x, this.projectile.velocity.y);

    // when it gets to the destination, this.state = 'exploding'
    if (this.projectile.overlap(this.target.sprite)) {
      // play the explosion sound and intialize the explosion object
      this.state = 'exploding';
      this.explosion = new Explosion(this.origin, this.target);

      // destroy the indicator and projetile sprites
      this.projectile.destroy();
      this.targetIndicator.destroy();
      this.originIndicator.destroy();

      if (this.origin.type === 'sub') {
        // console.log('sub hit');
        let data = {
          gameID: gameID,
          launchID: this.origin.ocean,
          targetID: this.target.continent,
          shooterID: this.origin.playerID
        };
        $.ajax({
          url: '/api/war/subshot',
          method: 'PUT',
          data: data,
          dataType: 'json'
        }).then(
          // r => console.log(r)
        );
      } else {
        // console.log('air hit');
        let data = {
          gameID: gameID,
          launchID: this.origin.continent,
          targetID: this.target.continent,
          type: this.origin.type
        };

        $.ajax({
          url: '/api/war/shot',
          method: 'PUT',
          data: data,
          dataType: 'json'
        }).then(
          // r => console.log(r)
        );
      }
    }
  }

  // while the explosion animation is happening
  exploding() {
    this.explosion.update();
    if (this.explosion.frame > 30) {
      this.explosion.destroy();
      this.origin.launch = false;
      this.explosion = false;
    }
  }
}

/*
EXPLOSION
*/
class Explosion {
  constructor(origin, target, phaserState) {
    this.phaserState = phaserState
    this.sprite = this.phaserState.add.sprite(target.sprite.centerX, target.sprite.centerY, 'circle');
    this.sprite.anchor.set(0.5);
    this.sprite.tint = colors[playerIDs.indexOf(origin.playerID)];
    this.sprite.alpha = liveAlpha;
    this.sprite.scale.set(0);
    this.frame = 0;

    this.phaserState.add.audio('explosion').play();
  }

  update() {
    this.frame++;
    this.sprite.scale.set(this.frame / 20);
    this.sprite.alpha -= 0.03;
  }

  destroy() {
    this.sprite.destroy();
  }
}

/*
INDICATORS
*/
class TargetIndicator {
  constructor(target, color, phaserState) {
    this.phaserState = phaserState;
    console.log(this.phaserState);
    this  .sprites = [
      this.phaserState.add.sprite(target.centerX, target.centerY, 'target01'),
      this.phaserState.add.sprite(target.centerX, target.centerY, 'target02'),
      this.phaserState.add.sprite(target.centerX, target.centerY, 'target03'),
      this.phaserState.add.sprite(target.centerX, target.centerY, 'target04')
    ];
    this.sprites.forEach(sprite => {
      sprite.anchor.set(0.5);
      sprite.tint = color;
      sprite.alpha = liveAlpha;
    })
    this.frame = 0;
  }

  update() {
    this.frame++;
    this.sprites.forEach((sprite, i) => {
      sprite.angle = this.frame * 10 * (.3 * i) * (i % 2 === 0 ? 1 : -1);
      sprite.scale.set(0.8 + (Math.sin((this.frame + 5 * i) / 5) * 0.35));
      sprite.alpha = (0.7 + (Math.sin((this.frame + 5 * i) / 5) * 0.3));
    });
  }

  destroy() {
    this.sprites.forEach(sprite => sprite.destroy());
  }
}

/*
LASER TRACKING STUFF
*/
class PlayerPointer {
  constructor(index, state) {
    this.playerIndex = index;
    this.playerID = playerIDs[index];
    this.sprite = state.game.add.sprite(state.game.width / 2, state.game.height / 2, 'circle');
    this.sprite.tint = colors[index];
    this.sprite.alpha = liveAlpha;
    this.sprite.scale.set(0.2);

    this.sprite.inputEnabled = true;
    this.sprite.input.enableDrag(true);

    this.intersection = null;
  }

  setPosition() {
    this.sprite.position = lasers[this.playerIndex] || {x: -50,y: -50};
  }

  intersecting() {
    if (this.intersection) {
      if (!this.intersection.checkOverlap()) {
        this.intersection = null;
        return false;
      }

      return true;
    } else {
      return false;
    }
  }

  checkIntersection(targetSprite, action, data) {
    if (this.sprite.overlap(targetSprite)) {
      this.intersection = new Intersection(this.sprite, targetSprite, action, data);
      return true;
    }

    return false;
  }
}

class Intersection {
  constructor(playerSprite, targetSprite, action, data) {
    this.playerSprite = playerSprite;
    this.targetSprite = targetSprite;
    this.action = action;
    this.data = data;
    this.count = 0;
  }

  checkOverlap() {
    if (this.playerSprite.overlap(this.targetSprite)) {
      this.count++;
      if (this.count > 10) {
        this.action(this.data);
        return false;
      };
      return true;
    } else {
      return false;
    }
  }
}
