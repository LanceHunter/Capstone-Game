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


  // The year
  let year = { year : 1950 };

  // Whose turn?
  const turn = {
    player : 0,
    war : false
  };

  // Player info
  const players = [
    {
      name : 'Player 1',
      number : 1,
      continents : [],
      oceans : [],
      rnd : 0,
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

  const winConditions = {
    yearsWithNoWeapons : 0
  }

  var game = new Vue({
    el : '#gtwGame',
    data : {
      continents : continents,
      oceans : oceans,
      year : year,
      winConditions : winConditions,
      players : players,
      turn : turn,
      allAssigned : false
    },
    methods : {
      assign : function(continent, number) {
        this.players.forEach((player) => {
          if (player.number === number) {
            player.continents.push(continent);
            continent.oceanAccess.forEach((ocean) => {
              if (!player.oceans.includes(ocean)) {
                player.oceans.push(ocean);
              }
            });
          }
        });
        continent.assignment = number;
        let finished = true;
        continents.forEach((cont) => {
          if (!cont.assignment) {
            finished = false;
          }
        });
        if (finished) {
          this.allAssigned = true;
          this.turn.player++;
        }
      }
    }

  });

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
      launchTo : ''
    },
    methods : {
      launch : function(playerID, start, end) {
        console.log('Damage done.');
      },
      endTurn : function(playerID) {
        if (playerID === this.player1.number) {
          turn.player = 2;
        }
        if (playerID === this.player2.number) {
          turn.player = 1;
        }
      }
    }

  });



})();
