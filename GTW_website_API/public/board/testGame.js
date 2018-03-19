/*
a test game object
*/
const game = {
  oceans : [
    {
      name : `Atlantic`,
      subs: {
        'player1' : {declared:0, total:0},
        'player2' : {declared:2, total:3},
        'player3' : {declared:1, total:3},
        'player4' : {declared:2, total:3},
        'player5' : {declared:3, total:3},
        'player6' : {declared:2, total:3},
      }
    },
    {
      name : `Pacific`,
      subs: {
        'player1' : {declared:1, total:3},
        'player2' : {declared:2, total:3},
        'player3' : {declared:1, total:3},
        'player4' : {declared:2, total:3},
        'player5' : {declared:3, total:3},
        'player6' : {declared:2, total:3},
      }
    },
    {
      name : `Indian`,
      subs: {
        'player1' : {declared:1, total:3},
        'player2' : {declared:2, total:3},
        'player3' : {declared:1, total:3},
        'player4' : {declared:2, total:3},
        'player5' : {declared:3, total:3},
        'player6' : {declared:2, total:3},
      }
    }
  ],

  continents : [
    {
      name : `North America`,
      assignment : null,
      budget : 1000,
      hp : 500,
      weapons: {
        'bombers' : {declared:2, total:2},
        'icbms' : {declared:1, total:3}
      },
      oceanAccess : ['Atlantic', 'Pacific']
    },
    {
      name : `South America`,
      assignment : null,
      budget : 750,
      hp : 750,
      weapons: {
        'bombers' : {declared:2, total:2},
        'icbms' : {declared:1, total:3}
      },
      oceanAccess : ['Atlantic', 'Pacific']
    },
    {
      name : `Asia`,
      assignment : null,
      budget : 500,
      hp : 1000,
      weapons: {
        'bombers' : {declared:2, total:2},
        'icbms' : {declared:1, total:3}
      },
      oceanAccess : ['Atlantic', 'Pacific']
    },
    {
      name : `Europe`,
      assignment : null,
      budget : 1100,
      hp : 400,
      weapons: {
        'bombers' : {declared:2, total:2},
        'icbms' : {declared:1, total:3}
      },
      oceanAccess : ['Atlantic', 'Pacific']
    },
    {
      name : `Africa`,
      assignment : null,
      budget : 600,
      hp : 900,
      weapons: {
        'bombers' : {declared:2, total:2},
        'icbms' : {declared:1, total:3}
      },
      oceanAccess : ['Atlantic', 'Pacific']
    },
    {
      name : `Australia`,
      assignment : null,
      budget : 800,
      hp : 700,
      weapons: {
        'bombers' : {declared:2, total:2},
        'icbms' : {declared:1, total:3}
      },
      oceanAccess : ['Atlantic', 'Pacific']
    }
  ],

  players : [
    {
      name : 'player1',
      number : 1,
      continents : [0],
      oceans : [0, 2],
      rnd : 0,
      thisYearBudget : 0,
      declaredForces : 0
    },
    {
      name : 'player2',
      number : 2,
      continents : [1],
      oceans : [0, 1],
      rnd : 0,
      thisYearBudget : 0,
      declaredForces : 0
    },
    {
      name : 'player3',
      number : 3,
      continents : [2],
      oceans : [0],
      rnd : 0,
      thisYearBudget : 0,
      declaredForces : 0
    },
    {
      name : 'player4',
      number : 4,
      continents : [3],
      oceans : [2],
      rnd : 0,
      thisYearBudget : 0,
      declaredForces : 0
    },
    {
      name : 'player5',
      number : 5,
      continents : [4],
      oceans : [1],
      rnd : 0,
      thisYearBudget : 0,
      declaredForces : 0
    },
    {
      name : 'player6',
      number : 6,
      continents : [5],
      oceans : [0, 1, 2],
      rnd : 0,
      thisYearBudget : 0,
      declaredForces : 0
    }
  ]
}
