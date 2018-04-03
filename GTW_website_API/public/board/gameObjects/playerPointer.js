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
