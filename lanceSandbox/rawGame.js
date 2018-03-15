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

  var player1Box = new Vue({ // The Vue for player 1's turn/actions. Player 2's vue is identical except for swapping 1/2 and some end-of-turn mechanics.
    el : '#player1Box', // Reference to the player box.
    data : {
      myNumber : 1, // Player's number
      continents : players[0].continents, // An easier way to access the player's continents.
      oceans : players[0].oceans, // An easier way to access the player's continents.
      year : year, // Access to the year object to know what year it is.
      winConditions : winConditions, // Access to the win conditions object in case a non-war win occurs.
      me : players[0], // Easier reference to the player as themselves.
      enemy : players[1], // Easier reference to the opponent as enemy.
      turn : turn, // The turn object.
      turnStart : false, // This is used so that the other player can end their turn and hand the computer to you so you can start your turn without them seeing your secret information.
      currentBudget : 0, // The player's budget.
      spyMessage : '' // For any cases of stealth rolls having failed.
    },

    methods : { // The methods.

      startTurn : function() {
        this.continents.forEach((continent) => { // Checking each of the player's continents.
          this.currentBudget += continent.budget; // First we add to the player's budget whatever amount of money that continent provides.
          this.currentBudget -= (continent.weapons.icbms.total * 20) + (continent.weapons.bombers.total * 10); // Then we subtract the maintinence cost of any bombers and ICBMs the continent has.
        }); // end of the continents forEach.
        this.oceans.forEach((ocean) => { // Then we check all the oceans the player can access...
          this.currentBudget -= (ocean.subs.player1.total * 20); // ..and subtract the maintinence cost of any subs the player has deployed.
        });
        this.turnStart = true; // Start the actual turn.
      }, // end of startTurn method.

      endTurn : function() {
        let noWeapons = true; // Start with the assumption no weapons are on the board for this player.
        this.continents.forEach((continent) => { // Go through all player's continents...
          if (continent.weapons.icbms.total !== 0 || continent.weapons.bombers.total !== 0) { // If there are any weapons...
            noWeapons = false; // We mark this boolean as false.
          }
        }); // End of the continents forEach.
        this.oceans.forEach((ocean) => {
          if (ocean.subs.player1.total !== 0) {
            noWeapons = false;
          }
        });
        winConditions.yearsWithNoWeapons += 0.5; // Add to the number of years/turns with no weapons.
        if (!noWeapons) { // ...but if there are weapons...
          winConditions.yearsWithNoWeapons = 0; // Turn that counter all the way back to zero.
        }
        this.turn.player = 2; // Mark that it is now player 2's turn.
        if (this.me.declaredForces > this.enemy.declaredForces*2 && this.enemy.declaredForces > 5) { // But if my declared forces are twice that of player 2...
          this.turn.player = 0; // Then it's no one's turn because I won.
        }
        this.me.rnd += this.currentBudget; // Add any remaining budget to the RND total.
        this.currentBudget = 0; // Set the budget back to 0.
        this.turnStart = false; // Set the turnStart to false so my info is hidden before I start my next turn.
      }, // end of the endTurn method.

      place : function(continent, type) {
        if (type==='icbm') { // If it's an ICBM...
          this.currentBudget -= 100; // ...deduct the cost of the ICBM from current budget.
          continent.weapons.icbms.total++; // ...and add an ICBM to that continent's total weapons.
        }
        if (type==='bomber') {
          this.currentBudget -= 50;// ...deduct the cost of the bomber from current budget.
          continent.weapons.bombers.total++; // ...and add a bomber to that continent's total weapons.
        }
      }, // end of the place function

      placeSub : function(ocean) {
        this.currentBudget -= 200; // Takes the cost out of the current budget.
        ocean.subs.player1.total++; // Increase the total number of subs for this player in this ocean.
      }, // end of the placeSub function.

      declare : function(continent, type) {
        this.me.declaredForces++; // Increase the my total declared forces.
        if (type === 'bomber') { // If it's a bomber...
          continent.weapons.bombers.declared++; // ...increase the declared bombers for that continent.
        }
        if (type === 'icbm') { // If it's an ICBM...
          continent.weapons.icbms.declared++; // ...increase the declared ICBMs for that continent.
        }
        // There's no validation on this, because the button disappears if declared forces equals the total forces, so this shouldn't be able to be called if it isn't possible.
      }, // end of the declare method.

      declareSub : function(ocean) {
        this.me.declaredForces++; // Add to the total number of declared forces.
        ocean.subs.player1.declared++; // Increase the declared subs for that player in that ocean.
        // There's no validation on this, because the button disappears if declared forces equals the total forces, so this shouldn't be able to be called if it isn't possible.
      }, // end of the declareSub method.

      disarm : function(continent, type) {
        if (type === 'bomber') { // If the type is a bomber.
          if (continent.weapons.bombers.declared > 0) { // If there are declared bombers...
            continent.weapons.bombers.declared--; // ..remove a declared bomber...
            this.me.declaredForces--; // ...and reduce the total number of declared forces.
          }
          continent.weapons.bombers.total--; // Remove the bomber itself from that continent.
        }
        if (type === 'icbm') { // If the type is an ICBM.
          if (continent.weapons.icbms.declared > 0) { // See if there are declared ICBMs...
            continent.weapons.icbms.declared--; // ...and if so, remove one...
            this.me.declaredForces--; // ...and reduce the total number of declared forces.
          }
          continent.weapons.icbms.total--; // Remove the ICBM itself from the total on that continent.
        }
      }, // End of disarm method.

      disarmSub : function(ocean) { // Removes a sub from a particular ocean.
        if (ocean.subs.player1.declared > 0) { // If there're declared subs...
          ocean.subs.player1.declared--; // ...remove a declared sub.
          this.me.declaredForces--; // ...and reduce the number of total declared forces.
        }
        ocean.subs.player1.total--; // ...remove a total sub from that player's listing on that ocean.
      }, // end of disarmSub method.

      warStart : function() {
        turn.war = true; // Changes the game from "Peacetime" to "war" mode.
      } // end of warStart method.

    } // End of the methods for Player 1's Vue
  }); // End of Player 1's Vue

  var player2Box = new Vue({ // Since this is essentially a mirror of Player 1's Vue, comments for this code will only include any differences between the two aside from swapping the 1/2 (or marking the end of methods)
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
          this.currentBudget -= (continent.weapons.icbms.total * 20) + (continent.weapons.bombers.total * 10);
        });
        this.oceans.forEach((ocean) => {
          this.currentBudget -= (ocean.subs.player2.total * 20);
        });
        this.turnStart = true;
      }, // end of startTurn method

      endTurn : function() {
        let noWeapons = true;
        this.continents.forEach((continent) => {
          if (continent.weapons.icbms.total !== 0 || continent.weapons.bombers.total !== 0) {
            noWeapons = false;
          }
        }); // end of continents forEach.
        this.oceans.forEach((ocean) => {
          if (ocean.subs.player2.total !== 0) {
            noWeapons = false;
          }
        }); // end of oceans forEach
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
        this.year.year++; // End of 2nd player's turn, so a new year begins.
        this.turnStart = false;
      }, // end of endTurn method.

      place : function(continent, type) {
        if (type==='icbm') {
          this.currentBudget -= 100;
          continent.weapons.icbms.total++;
        }
        if (type==='bomber') {
          this.currentBudget -= 50;
          continent.weapons.bombers.total++;
        }
      }, // end of place methods.

      placeSub : function(ocean, type) {
        this.currentBudget -= 200;
        ocean.subs.player2.total++;
      }, // end of placeSub method.

      declare : function(continent, type) {
        this.me.declaredForces++;
        if (type === 'bomber') {
          continent.weapons.bombers.declared++;
        }
        if (type === 'icbm') {
          continent.weapons.icbms.declared++;
        }
      }, // end of declare method.

      declareSub : function(ocean) {
        this.me.declaredForces++;
        ocean.subs.player2.declared++;
      }, // end of declareSub method

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
      }, // end of disarm method.

      disarmSub : function(ocean) {
        if (ocean.subs.player2.declared > 0) {
          ocean.subs.player2.declared--;
          this.me.declaredForces--;
        }
        ocean.subs.player2.total--;
      }, // end of disarmSub method

      warStart : function() {
        turn.war = true;
      } // end of warStart method
    }

  });

  var warGame = new Vue({ // The Vue for the War portion of the game.
    el : '#warGame',
		data : {
      player1 : players[0],
      player2 : players[1],
      continents : continents,
      oceans : oceans,
      turn : turn,
      launchFrom : '',
      launchTo : ''
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
              target.hp -= (50 + Math.floor(this.player1.rnd/500)*5);
              if (target.hp <= 0 ) {
                target.name = 'DESTROYED!!!';
              }
            } else if (launchSpot.weapons.icbms.total > 0) {
              launchSpot.weapons.icbms.total--;
              target.hp -= (50 + Math.floor(this.player1.rnd/500)*5);
              if (target.hp <= 0 ) {
                target.name = 'DESTROYED!!!';
              }
            }
          } else if (launchSpot.subs.player1.total > 0) {
            launchSpot.subs.player1.total--;
            target.hp -= (50 + Math.floor(this.player1.rnd/500)*5);
            if (target.hp <= 0 ) {
              target.name = 'DESTROYED!!!';
            }
          }

        } // end of "if playerID === 1" section

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
              target.hp -= (50 + Math.floor(this.player2.rnd/500)*5);
              if (target.hp <= 0 ) {
                target.name = 'DESTROYED!!!';
              }
            } else if (launchSpot.weapons.icbms.total > 0) {
              launchSpot.weapons.icbms.total--;
              target.hp -= (50 + Math.floor(this.player2.rnd/500)*5);
              if (target.hp <= 0 ) {
                target.name = 'DESTROYED!!!';
              }
            }
          } else if (launchSpot.subs.player2.total > 0) {
            launchSpot.subs.player2.total--;
            target.hp -= (50 + Math.floor(this.player1.rnd/500)*5);
            if (target.hp <= 0 ) {
              target.name = 'DESTROYED!!!';
            }
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
        turn.shotsFired = 0;
      }

    }

  });



})();
