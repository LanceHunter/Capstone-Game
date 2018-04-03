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
