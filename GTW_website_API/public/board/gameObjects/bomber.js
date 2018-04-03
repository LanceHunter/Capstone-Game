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
