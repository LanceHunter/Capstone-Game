class Launch {
  constructor(origin, phaserState) {
    // the phaser object
    this.phaserState = phaserState;

    // the origin icon object
    this.origin = origin;

    // setup the origin indicator
    this.originIndicator = new Indicator(this.origin.sprite, colors[playerIDs.indexOf(this.origin.playerID)], this.phaserState);

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
    // animate the originIndicator only
    this.originIndicator.update();
  }

  initLaunch() {
    // create the target indicator
    this.targetIndicator = new Indicator(this.target.sprite, colors[playerIDs.indexOf(this.origin.playerID)], this.phaserState);

    // create and setup the projectile sprite, might want to be it's own object in the future
    this.projectile = this.phaserState.add.sprite(this.origin.sprite.centerX, this.origin.sprite.centerY, 'projectile');
    this.projectile.tint = colors[playerIDs.indexOf(this.origin.playerID)];
    this.projectile.anchor.set(0.5);
    this.projectile.alpha = liveAlpha;

    // and figure out it's path, velocity and orientation
    this.targetCenter = new Phaser.Point(this.target.sprite.centerX, this.target.sprite.centerY);
    let velocity = 10 + (game.players[this.origin.playerID].rnd.speed * 2 / 500);
    this.projectile.velocity = Phaser.Point.subtract(this.targetCenter, this.projectile.position).normalize().multiply(velocity, velocity);
    this.projectile.rotation = Phaser.Point.angle(this.origin.sprite.position, this.target.sprite.position) - (Math.PI / 2);

    // play the launch sound
    this.phaserState.add.audio('launch').play();

    // change state
    this.state = 'enroute';
  }

  // when user paints a destination
  launch(capital, playerID) {
    // if it's armed, initLaunch
    if (this.state === 'armed') {
      this.target = capital;

      // check that the capital doesn't belong to the origin and isn't already dead
      if (this.target.playerID != this.origin.playerID && game.continents[this.target.continent].hp > 0) {
        // subs have specific logic:
        if (this.origin.type === 'sub') {
          // check for valid sub launch
          if (Object.keys(game.oceans[this.origin.ocean].canHit).includes(this.target.continent)) {
            this.initLaunch();
          } else {
            //console.log('invalid sub');
          }
        } else
        // bombers have a range:
        if (this.origin.type === 'bomber') {
          // check for valid bomber launch
          if (game.continents[this.origin.continent].distances[this.target.continent] <= 1) {
            this.initLaunch();
          } else {
            // console.log('invalid bomb');
          }
        } else {
          // ICBMs can go anywhere, shoot that shit!
          this.initLaunch();
        }
      }
    }
  }

  // while the missile is traveling
  enroute() {
    // we need to keep animating our indicators
    this.originIndicator.update();
    this.targetIndicator.update();

    // and update the position of our projectile
    this.projectile.position.add(this.projectile.velocity.x, this.projectile.velocity.y);

    // when it gets to the destination, this.state = 'exploding'
    if (this.projectile.overlap(this.target.sprite)) {
      // play the explosion sound and intialize the explosion object
      this.state = 'exploding';
      this.explosion = new Explosion(this.origin, this.target, this.phaserState);

      // destroy the indicator and projectile sprites
      this.projectile.destroy();
      this.targetIndicator.destroy();
      this.originIndicator.destroy();

      // we figure out what kind of weapon it was, and make the right API call
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

    // when the explosion is done, we destroy it and reset everything
    if (this.explosion.frame > 30) {
      this.explosion.destroy();
      this.origin.launch = false;
      this.explosion = false;
    }
  }
}
