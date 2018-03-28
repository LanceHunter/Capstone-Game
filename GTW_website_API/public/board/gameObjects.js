/*
TARGETS
*/
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
    this.updateState();

    this.playerID = Object.keys(game.continents[this.continent].player)[0];
  }

  // triggered when the firebase state changes
  updateState() {
    if (game.war) {
      this.sprite.inputEnabled = true;
    }

    this.hitPoints.setText(game.continents[this.continent].hp);
    this.hitPoints.position.x = this.sprite.centerX - (this.hitPoints.width / 2);

    // if they are out of hit points
    if (game.continents[this.continent].hp <= 0) {
      this.sprite.alpha = 0.2;
      this.hitPoints.alpha = 0.2;
    }
    if (game.peacetime) {
      this.sprite.alpha = 1;
      this.hitPoints.alpha = 1;
    }
    if (game.war) {
      this.sprite.alpha = alphaAdjust;
      this.hitPoints.alpha = alphaAdjust;
    }

    this.hitPoints.setText(game.continents[this.continent].hp);
    this.hitPoints.position.x = this.sprite.centerX - (this.hitPoints.width / 2);

    this.sprite.tint = colors[playerIDs.indexOf(Object.keys(game.continents[this.continent].player)[0])];
  }

  // triggered when a capital is painted
  select(data) {
    let self = data.self;
    let pointer = data.pointer;
    // check that you aren't painting your own capital
    if (pointer.playerID != self.playerID) {
      // and that the capital has hp
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
*/
class SubIcon {
  constructor(x, y, ocean, playerID) {
    this.type = 'sub';
    this.sprite = phaser.add.sprite(x, y, 'submarine');
    this.sprite.anchor.set(0, 1);
    this.playerID = playerID;
    this.ocean = ocean;
    this.inventory = phaser.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);
    this.updateState();
  }

  updateState() {
    // if the sub's player can be in that ocean
    if (game.oceans[this.ocean].subs[this.playerID]) {
      //check for game state and update inventory accordingly
      if (game.war) {
        this.inventory.setText(game.oceans[this.ocean].subs[this.playerID].total);

        // if they are out of ammo
        if (game.oceans[this.ocean].subs[this.playerID].total <= 0) {
          this.sprite.alpha = 0.2;
          this.inventory.alpha = 0.2;
        } else {
          this.sprite.alpha = alphaAdjust;
          this.inventory.alpha = alphaAdjust;
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

  update() {
    if (this.launch) {
      this.launch.update();
    }
  }

  select(data) {
    let self = data.self;
    let pointer = data.pointer;

    // is it your sub?
    if (self.playerID === pointer.playerID) {
      if (game.oceans[self.ocean].subs[self.playerID] && game.oceans[self.ocean].subs[self.playerID].total > 0) {
        if (!self.launch) {
          self.launch = new Launch(self);
        } else {
          console.log('there is already a launch in progress');
        }
      } else {
        console.log('no ammo');
      }
    }
  }
}

class BomberIcon {
  constructor(x, y, continent) {
    this.type = 'bomber';
    this.sprite = phaser.add.sprite(x, y, 'bomber');
    this.sprite.anchor.set(0, 1);
    this.continent = continent;
    this.playerID = Object.keys(game.continents[this.continent].player)[0];
    this.continent = continent;
    this.launches = [];
    this.inventory = phaser.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);

    this.updateState();
  }

  updateState() {
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
        this.sprite.alpha = alphaAdjust;
        this.inventory.alpha = alphaAdjust;
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

  update() {
    if (this.launch) {
      this.launch.update();
    }
  }

  select(data) {
    let self = data.self;
    let pointer = data.pointer;

    // is it your sub?
    if (self.playerID === pointer.playerID) {
      if (game.continents[self.continent].forces.bombers.total > 0) {
        if (!self.launch) {
          self.launch = new Launch(self);
        } else {
          console.log('there is already a launch in progress');
        }
      } else {
        console.log('no ammo');
      }
    }
  }
}

class MissileIcon {
  constructor(x, y, continent) {
    this.continent = continent
    this.playerID = Object.keys(game.continents[this.continent].player)[0];
    this.sprite = phaser.add.sprite(x, y, 'missile');
    this.sprite.anchor.set(0, 1);
    this.sprite.tint = colors[playerIDs.indexOf(this.playerID)];
    this.inventory = phaser.add.bitmapText(this.sprite.centerX, this.sprite.position.y, 'closeness', '0', 32);
    this.inventory.tint = colors[playerIDs.indexOf(this.playerID)];
    this.type="icbm";

    this.updateState();
  }

  updateState() {
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
        this.sprite.alpha = alphaAdjust;
        this.inventory.alpha = alphaAdjust;
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

  update() {
    if (this.launch) {
      this.launch.update();
    }
  }

  select(data) {
    let self = data.self;
    let pointer = data.pointer;

    // is it your sub?
    if (self.playerID === pointer.playerID) {
      if (game.continents[self.continent].forces.icbms.total > 0) {
        console.log(self.launch);
        if (!self.launch) {
          self.launch = new Launch(self);
        } else {
          console.log('there is already a launch in progress');
        }
      } else {
        console.log('no ammo');
      }
    }
  }
}

/*
LAUNCH
*/
class Launch {
  // these will be created whenever a players's sub-deploy thing is activated
  constructor(origin) {
    this.origin = origin;

    this.originIndicator = new TargetIndicator(this.origin.sprite, colors[playerIDs.indexOf(this.origin.playerID)]);

    // first we arm the weapon
    this.state = 'armed';
  }

  // the method to call on every game loop iteration, calls a method depending on state
  update() {
    this.frame++;
    this[this.state]();
  }

  // a weapon has been selected, launch is pending
  armed() {
    this.originIndicator.update();
  }

  // when user paints a destination
  launch(capital, playerID) {
    this.target = capital;

    // check that the capital doesn't belong to the origin and isn't already dead
    if (this.target.playerID != this.origin.playerID && game.continents[this.target.continent].hp > 0) {
      if (this.origin.type === 'sub') {
        // check for valid sub launch
        if (Object.keys(game.oceans[this.origin.ocean].canHit).includes(this.target.continent)) {
          // sprite stuff
          this.targetIndicator = new TargetIndicator(capital.sprite, colors[playerIDs.indexOf(this.origin.playerID)]);

          this.projectile = phaser.add.sprite(this.origin.sprite.centerX, this.origin.sprite.centerY, 'circle');
          this.projectile.tint = colors[playerIDs.indexOf(playerID)];
          this.projectile.anchor.set(0.5);
          this.projectile.scale.set(0.3);
          this.targetCenter = new Phaser.Point(this.target.sprite.centerX, this.target.sprite.centerY);
          this.projectile.velocity = Phaser.Point.subtract(this.targetCenter, this.projectile.position).normalize().multiply(10, 10);

          this.state = 'enroute';
          this.targetFrame = 0;
        } else {
          console.log('invalid sub');
        }
      } else
      if (this.origin.type === 'bomber') {
        // check for valid bomber launch
        if (game.continents[this.origin.continent].distances[this.target.continent] === 1) {
          console.log('valid bomb');
          // sprite stuff
          this.targetIndicator = new TargetIndicator(capital.sprite, colors[playerIDs.indexOf(this.origin.playerID)]);

          this.projectile = phaser.add.sprite(this.origin.sprite.centerX, this.origin.sprite.centerY, 'circle');
          this.projectile.tint = colors[playerIDs.indexOf(playerID)];
          this.projectile.anchor.set(0.5);
          this.projectile.scale.set(0.3);
          this.targetCenter = new Phaser.Point(this.target.sprite.centerX, this.target.sprite.centerY);
          this.projectile.velocity = Phaser.Point.subtract(this.targetCenter, this.projectile.position).normalize().multiply(10, 10);

          this.state = 'enroute';
          this.targetFrame = 0;
        } else {
          console.log('invalid bomb');
        }
      } else {
        // sprite stuff
        this.targetIndicator = new TargetIndicator(capital.sprite, colors[playerIDs.indexOf(this.origin.playerID)]);

        this.projectile = phaser.add.sprite(this.origin.sprite.centerX, this.origin.sprite.centerY, 'circle');
        this.projectile.tint = colors[playerIDs.indexOf(playerID)];
        this.projectile.anchor.set(0.5);
        this.projectile.scale.set(0.3);
        this.targetCenter = new Phaser.Point(this.target.sprite.centerX, this.target.sprite.centerY);
        this.projectile.velocity = Phaser.Point.subtract(this.targetCenter, this.projectile.position).normalize().multiply(10, 10);

        this.state = 'enroute';
        this.targetFrame = 0;
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
      this.state = 'exploding';
      this.explodingFrame = 0;
      this.projectile.destroy();
      this.targetIndicator.destroy();
      this.originIndicator.destroy();

      if (this.origin.type === 'sub') {
        console.log('sub hit');
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
          r => console.log(r)
        );
      } else {
        console.log('air hit');
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
          r => console.log(r)
        );
      }
    }
  }

  // while the explosion animation is happening
  exploding() {
    this.explodingFrame++;
    if (this.explodingFrame > 20) {
      this.origin.launch = false;
    }
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
    this.sprite.alpha = alphaAdjust;
    this.sprite.scale.set(0.2);

    this.sprite.inputEnabled = true;
    this.sprite.input.enableDrag(true);

    this.intersection = null;
  }

  setPosition() {
    this.sprite.position = lasers[this.playerIndex] || {x: 0,y: 0};
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

/*
INDICATORS
*/
class TargetIndicator {
  constructor(target, color) {
    this.sprites = [
      phaser.add.sprite(target.centerX, target.centerY, 'target01'),
      phaser.add.sprite(target.centerX, target.centerY, 'target02'),
      phaser.add.sprite(target.centerX, target.centerY, 'target03'),
      phaser.add.sprite(target.centerX, target.centerY, 'target04')
    ];
    this.sprites.forEach(sprite => {
      sprite.anchor.set(0.5);
      sprite.tint = color;
      sprite.alpha = alphaAdjust;
    })
    this.frame = 0;
  }

  update() {
    this.frame++;
    this.sprites.forEach((sprite, i) => {
      sprite.angle = this.frame * 10 * (.3 * i) * (i % 2 === 0 ? 1 : -1);
      sprite.scale.set(0.8 + (Math.sin((this.frame + 5 * i) / 5) * 0.35));
      sprite.alpha = (0.5 + (Math.sin((this.frame + 5 * i) / 5) * 0.2));
    });
  }

  destroy() {
    this.sprites.forEach(sprite => sprite.destroy());
  }
}
