(function() {

  // Continent info.
  const continents = [
    { name : `northAmerica`,
      assignment : null,
      budget : 1000,
      hp : 500,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      }
    },
    { name : `southAmerica`,
      assignment : null,
      budget : 750,
      hp : 750,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      }
    },
    { name : `asia`,
      assignment : null,
      budget : 500,
      hp : 1000,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      }
    },
    { name : `europe`,
      assignment : null,
      budget : 1100,
      hp : 400,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      }
    },
    { name : `africa`,
      assignment : null,
      budget : 600,
      hp : 900,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      }
    },
    { name : `australia`,
      assignment : null,
      budget : 800,
      hp : 700,
      weapons: {
        'bombers' : {declared:0, total:0},
        'icbms' : {declared:0, total:0}
      }
    }
  ];

  // Oceans info.
  const oceans = [
    { name : `atlantic`,
      weapons: {
        'subs' : []
      }
    },
    { name : `pacific`,
      weapons: {
        'subs' : []
      }
    },
    { name : `indian`,
      weapons: {
        'subs' : []
      }
    }
  ];

  // The year
  let year = 1950;

  // Whose turn?
  let turn = 2;

  // Player info
  const players = [
    {
      name : 'Player 1',
      number : 1,
      continents : [],
      rnd : 0
    },
    {
      name : 'Player 2',
      number : 2,
      continents : [],
      rnd : 0
    }
  ];


  var game = new Vue({
    el : '#gtwGame',
    data : {
      continents : continents,
      oceans : oceans,
      year : year,
      players : players,
      turn : turn
    },
    methods : {
      assign : function(continent, number) {
        this.players.forEach((player) => {
          if (player.number === number) { player.continents.push(continent); }
        });
        continent.assignment = number;
        console.log('Players continents - ', this.players);
      }
    }

  });

  var player1Box = new Vue({
    el : '#player1Box',
    data : {
      myNumber : 1,
      continents : continents,
      oceans : oceans,
      year : year,
      players : players,
      turn : turn
    },
    methods : {

    }
  });

  var player2Box = new Vue({
    el : '#player2Box',
    data : {
      myNumber : 2,
      continents : continents,
      oceans : oceans,
      year : year,
      players : players,
      turn : turn
    },
    methods : {
      spendBudget : function() {

      }
    }
  });



})();
