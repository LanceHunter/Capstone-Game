/*
icon object of capitals
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
