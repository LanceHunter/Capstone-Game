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
