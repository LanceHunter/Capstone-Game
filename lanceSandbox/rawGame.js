(function() {

  // Oceans info.
  const oceans = [
    { name : `Atlantic`,
      subs: {
        'player1' : {declared:0, total:0},
        'player2' : {declared:0, total:0}
      }
    },
    { name : `Pacific`,
      subs: {
        'player1' : {declared:0, total:0},
        'player2' : {declared:0, total:0}
      }
    },
    { name : `Indian`,
      subs: {
        'player1' : {declared:0, total:0},
        'player2' : {declared:0, total:0}
      }
    }
  ];


  // Continent info.
  const continents = [
    { name : `North America`,
      assignment : null,
      budget : 1000,
      hp : 500,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      },
      oceanAccess : [oceans[0], oceans[1]]
    },
    { name : `South America`,
      assignment : null,
      budget : 750,
      hp : 750,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      },
      oceanAccess : [oceans[0], oceans[1]]
    },
    { name : `Asia`,
      assignment : null,
      budget : 500,
      hp : 1000,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      },
      oceanAccess : [oceans[2], oceans[1]]
    },
    { name : `Europe`,
      assignment : null,
      budget : 1100,
      hp : 400,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      },
      oceanAccess : [oceans[0]]
    },
    { name : `Africa`,
      assignment : null,
      budget : 600,
      hp : 900,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      },
      oceanAccess : [oceans[0], oceans[2]]
    },
    { name : `Australia`,
      assignment : null,
      budget : 800,
      hp : 700,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      },
      oceanAccess : [oceans[2], oceans[1]]
    }
  ];


  // The year object. The only relevant information here is year.year the year number.
  let year = { year : 1950 };

  // The turn object. This will show whose turn it is, if war has begin or not, and how many shots have been fired in the turn.
  const turn = {
    player : 0,
    war : false,
    shotsFired : 0
  };

  // Players of the game. Two players for now.
  const players = [
    {
      name : 'Player 1',
      number : 1,
      continents : [], // This will be filled with references continent objects.
      oceans : [], // This will be filled with references ocean objects.
      rnd : 0, // The R&D money spent by player.
      thisYearBudget : 0,
      declaredForces : 0
    },
    {
      name : 'Player 2',
      number : 2,
      continents : [],
      oceans : [],
      rnd : 0,
      thisYearBudget: 0,
      declaredForces : 0
    }
  ];

  // For non-violent methods of winning. (Currently only years with no weapons on the planet.)
  const winConditions = {
    yearsWithNoWeapons : 0
  }

  // The Vue for the main game board.
  var game = new Vue({
    el : '#gtwGame', // The ID of the area where game element occurs.
    data : {
      continents : continents,
      oceans : oceans,
      year : year,
      winConditions : winConditions,
      players : players,
      turn : turn,
      allAssigned : false // Boolean to determine if all continents have been claimed, so game can move from the "setup" phase to the "peacetime" phase.
    },
    methods : {
      // The assign function is used when players pick continents at the "setup" phase of the game.
      assign : function(continent, number) {
        this.players.forEach((player) => { // We go through the players...
          if (player.number === number) { // Find the player whose number matches.
            player.continents.push(continent); // Add the continent to that player's continent array.
            continent.oceanAccess.forEach((ocean) => { // Then add any oceans that continent can access.
              if (!player.oceans.includes(ocean)) { // But make sure it hasn't been added before.
                player.oceans.push(ocean);
              }
            }); // End of the ocean forEach statement.
          }
        }); //End of player forEach statement.
        continent.assignment = number; // Note on the continent where it was assigned.
        let finished = true; // Mark finished as true in case this is the last continent.
        continents.forEach((cont) => { // Go through all the continents...
          if (!cont.assignment) { // ...and if any not assigned...
            finished = false; // ... recognize that we aren't finished.
          }
        }); // End of the continents forEach statement.
        if (finished) { // If we are finished...
          this.allAssigned = true; // Note that all are assigned.
          this.turn.player++; // Change the turn from 0 to 1.
        }// end of "if we are finished" if statement.
      } // end of "assign" method.
    } // end of all methods for "game" Vue.
  }); // end of "game" Vue.

  var player1Box = new Vue({
    el : '#player1Box',
    data : {
      myNumber : 1,
      continents : players[0].continents,
      oceans : players[0].oceans,
      year : year,
      winConditions : winConditions,
      me : players[0],
      enemy : players[1],
      turn : turn,
      turnStart : false,
      currentBudget : 0
    },

    methods : {

      startTurn : function() {
        this.continents.forEach((continent) => {
          this.currentBudget += continent.budget;
          this.currentBudget -= (continent.weapons.icbms.total * 10) + (continent.weapons.bombers.total * 20);
        });
        this.oceans.forEach((ocean) => {
          this.currentBudget -= (ocean.subs.player1.total * 20);
        })
        this.turnStart = true;
        console.log('Turn.player - ', turn.player);
      },

      endTurn : function() {
        let noWeapons = true;
        this.continents.forEach((continent) => {
          if (continent.weapons.icbms.total !== 0 || continent.weapons.bombers.total !== 0) {
            noWeapons = false;
          }
        });
        this.oceans.forEach((ocean) => {
          if (ocean.subs.player1.total !== 0) {
            noWeapons = false;
          }
        });
        winConditions.yearsWithNoWeapons += 0.5;
        if (!noWeapons) {
          winConditions.yearsWithNoWeapons = 0;
        }
        this.turn.player = 2;
        if (this.me.declaredForces > this.enemy.declaredForces*2 && this.enemy.declaredForces > 5) {
          this.turn.player = 0;
        }
        this.me.rnd += this.currentBudget;
        this.currentBudget = 0;
        this.turnStart = false;
      },

      place : function(continent, type) {
        if (type==='icbm') {
          this.currentBudget -= 100;
          continent.weapons.icbms.total++;
        }
        if (type==='bomber') {
          this.currentBudget -= 100;
          continent.weapons.bombers.total++;
        }
      },

      placeSub : function(ocean) {
        this.currentBudget -= 200;
        ocean.subs.player1.total++;
      },

      declare : function(continent, type) {
        this.me.declaredForces++;
        if (type === 'bomber') {
          continent.weapons.bombers.declared++;
        }
        if (type === 'icbm') {
          continent.weapons.icbms.declared++;
        }
      },

      declareSub : function(ocean) {
        this.me.declaredForces++;
        ocean.subs.player1.declared++;
      },

      disarm : function(continent, type) {
        if (type === 'bomber') {
          if (continent.weapons.bombers.declared > 0) {
            continent.weapons.bombers.declared--;
            this.me.declaredForces--;
          }
          continent.weapons.bombers.total--;
        }
        if (type === 'icbm') {
          if (continent.weapons.icbms.declared > 0) {
            continent.weapons.icbms.declared--;
          }
          continent.weapons.icbms.total--;
        }
      },

      disarmSub : function(ocean) {
        if (ocean.subs.player1.declared > 0) {
          ocean.subs.player1.declared--;
          this.me.declaredForces--;
        }
        ocean.subs.player1.total--;
      },

      warStart : function() {
        console.log('War were declared.');
        turn.war = true;
      }

    }
  });

  var player2Box = new Vue({
    el : '#player2Box',
		data : {
      myNumber : 2,
			continents : players[1].continents,
      oceans : players[1].oceans,
      year : year,
      winConditions : winConditions,
      me : players[1],
      enemy : players[0],
      turn : turn,
      turnStart : false,
      currentBudget : 0
    },

    methods : {

      startTurn : function() {
        this.continents.forEach((continent) => {
          this.currentBudget += continent.budget;
        });
        this.turnStart = true;
        console.log('Turn.player - ', turn.player);
      },

      endTurn : function() {
        let noWeapons = true;
        this.continents.forEach((continent) => {
          if (continent.weapons.icbms.total !== 0 || continent.weapons.bombers.total !== 0) {
            noWeapons = false;
          }
        });
        this.oceans.forEach((ocean) => {
          if (ocean.subs.player2.total !== 0) {
            noWeapons = false;
          }
        });
        winConditions.yearsWithNoWeapons += 0.5;
        if (!noWeapons) {
          winConditions.yearsWithNoWeapons = 0;
        }
        this.turn.player = 1;
        if (winConditions.yearsWithNoWeapons >= 3) {
          this.turn.player = 0;
        }
        if (this.me.declaredForces > this.enemy.declaredForces*2 && this.enemy.declaredForces > 5) {
          this.turn.player = 0;
        }
        this.me.rnd += this.currentBudget;
        this.currentBudget = 0;
        this.year.year++;
        this.turnStart = false;
      },

      place : function(continent, type) {
        if (type==='icbm') {
          this.currentBudget -= 100;
          continent.weapons.icbms.total++;
        }
        if (type==='bomber') {
          this.currentBudget -= 100;
          continent.weapons.bombers.total++;
        }
      },

      placeSub : function(ocean, type) {
        this.currentBudget -= 200;
        ocean.subs.player2.total++;
      },

      declare : function(continent, type) {
        this.me.declaredForces++;
        if (type === 'bomber') {
          continent.weapons.bombers.declared++;
        }
        if (type === 'icbm') {
          continent.weapons.icbms.declared++;
        }
      },

      declareSub : function(ocean) {
        this.me.declaredForces++;
        ocean.subs.player2.declared++;
      },

      disarm : function(continent, type) {
        if (type === 'bomber') {
          if (continent.weapons.bombers.declared > 0) {
            continent.weapons.bombers.declared--;        this.me.declaredForces--;
          }
          continent.weapons.bombers.total--;
        }
        if (type === 'icbm') {
          if (continent.weapons.icbms.declared > 0) {
            continent.weapons.icbms.declared--;
          }
          continent.weapons.icbms.total--;
        }
      },

      disarmSub : function(ocean) {
        if (ocean.subs.player2.declared > 0) {
          ocean.subs.player2.declared--;
          this.me.declaredForces--;
        }
        ocean.subs.player2.total--;
      },

      warStart : function() {
        console.log('War were declared.');
        turn.war = true;
      }

    }
  });

  var warGame = new Vue({

    el : '#warGame',
		data : {
      player1 : players[0],
      player2 : players[1],
      continents : continents,
      oceans : oceans,
      turn : turn,
      launchFrom : '',
      launchTo : '',
      numberFired : 0
    },
    methods : {
      launch : function(playerID) {
        turn.shotsFired++;
        if (playerID === 1) {
          let launchSpot;
          let target;
          this.player1.continents.forEach((continent) => {
            console.log('The continent.', continent.name)
            if (this.launchFrom.includes(continent.name)) {
              console.log('Continent found!');
              launchSpot = continent;
            }
          });
          this.player1.oceans.forEach((ocean) => {
            if (this.launchFrom.includes(ocean.name)) {
              console.log('Ocean found!');
              launchSpot = ocean;
            }
          });
          console.log('LaunchSpot - ', launchSpot);
          this.player2.continents.forEach((continent) => {
            if (this.launchTo.includes(continent.name)) {
              console.log('Target found!');
              target = continent;
            }
          });

          if (launchSpot.hp > 0) {
            if (launchSpot.weapons.bombers.total > 0) {
              launchSpot.weapons.bombers.total--;
              target.hp -= (25 + Math.floor(this.player1.rnd/500)*5);
            } else if (launchSpot.weapons.icbms.total > 0) {
              launchSpot.weapons.icbms.total--;
              target.hp -= (25 + Math.floor(this.player1.rnd/500)*5);
            }
          } else if (launchSpot.subs.player1.total > 0) {
            launchSpot.subs.player1.total--;
            target.hp -= (25 + Math.floor(this.player1.rnd/500)*5);
          }

        }

        if (playerID === 2) {
          let launchSpot;
          let target;
          this.player2.continents.forEach((continent) => {
            console.log('The continent.', continent.name)
            if (this.launchFrom.includes(continent.name)) {
              console.log('Continent found!');
              launchSpot = continent;
            }
          });
          this.player2.oceans.forEach((ocean) => {
            if (this.launchFrom.includes(ocean.name)) {
              console.log('Ocean found!');
              launchSpot = ocean;
            }
          });
          console.log('LaunchSpot - ', launchSpot);
          this.player1.continents.forEach((continent) => {
            if (this.launchTo.includes(continent.name)) {
              console.log('Target found!');
              target = continent;
            }
          });

          if (launchSpot.hp > 0) {
            if (launchSpot.weapons.bombers.total > 0) {
              launchSpot.weapons.bombers.total--;
              target.hp -= (25 + Math.floor(this.player2.rnd/500)*5);
            } else if (launchSpot.weapons.icbms.total > 0) {
              launchSpot.weapons.icbms.total--;
              target.hp -= (25 + Math.floor(this.player2.rnd/500)*5);
            }
          } else if (launchSpot.subs.player2.total > 0) {
            launchSpot.subs.player2.total--;
            target.hp -= (25 + Math.floor(this.player1.rnd/500)*5);
          }

        }

      },


      endTurn : function(playerID) {
        if (playerID === this.player1.number) {
          turn.player = 2;
        }
        if (playerID === this.player2.number) {
          turn.player = 1;
        }
        this.shotsFired = 0;
      }

    }

  });



})();
