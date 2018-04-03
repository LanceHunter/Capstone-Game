class Explosion {
  constructor(origin, target, phaserState) {
    // our phaser state object
    this.phaserState = phaserState

    // setup the sprite
    this.sprite = this.phaserState.add.sprite(target.sprite.centerX, target.sprite.centerY, 'circle');
    this.sprite.anchor.set(0.5);
    this.sprite.tint = colors[playerIDs.indexOf(origin.playerID)];
    this.sprite.alpha = liveAlpha;
    this.sprite.scale.set(0);
    this.frame = 0;

    // and play the sound
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
