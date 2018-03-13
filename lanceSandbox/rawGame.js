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
    },

  ];

  var game = new Vue({
    el : '#gtwGame',
    data : {
      continents : continents,
      oceans : oceans,
      year : 1950,
      players : 2
    },

  });




})();
