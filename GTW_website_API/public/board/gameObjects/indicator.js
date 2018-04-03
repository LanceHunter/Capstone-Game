class Indicator {
  constructor(target, color, phaserState) {
    this.phaserState = phaserState;

    // setup the sprites that comprise the indicator
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

    // and give us an animation reference frame
    this.frame = 0;
  }

  update() {
    // increment the frame
    this.frame++;
    // and transform all the sprites accordingly
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
