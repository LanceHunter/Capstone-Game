'use strict';

// Firebase setup.
const admin = require("firebase-admin");
const serviceAccount = require('../../../private/gtwthegame-firebase-adminsdk-xemv3-858ad1023b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gtwthegame.firebaseio.com"
});

const firebase = admin.database();
const ref = firebase.ref('gameInstance');

//Setting up express routing
const router = require('koa-router')();

router.prefix('/api/pregame');

console.log('checking setup');
router.post('/setup', async (ctx) => {
  console.log('in setup');
  // Will need some form of verification to make sure we've got a valid board.
  let gameID = Math.floor(Math.random()*10000);
  let gameInstanceRef = ref.child(`game${gameID}`);
  await gameInstanceRef.set({
    year : 1950,
    gameStarted : false, // For when a game has moved past player entry and into the "choose continents" phase..
    peacetime : false,// Pushing this to firebase so all devices know when continent is over and peacetime begins.
    war : false, // Pushing this to firebase so all devices know war has started.
    gameOver : false, // Boolean to be flipped if/when a victory condition (or final lose condition) is achieved.
    yearsWithNoWeapons : 0,
    continents : {
      // Continent info for North America.
      northAmerica : {
        name : 'North America',
        budget : 1000,
        hp : 500,
        player : false,
        forces : {
          bombers : {
            declared : 0,
            total : 0
          },
          icbms : {
            declared : 0,
            total : 0
          }
        },
        oceans : {
          atlantic : true,
          pacific : true
        },
        distances : {
          southAmerica : 0,
          asia : 3,
          europe : 2,
          africa : 3,
          australia : 4
        }
      },
      // Continent info for South America.
      southAmerica : {
        name : 'South America',
        budget : 750,
        hp : 750,
        player : false,
        forces : {
          bombers : {
            declared : 0,
            total : 0
          },
          icbms : {
            declared : 0,
            total : 0
          }
        },
        oceans : {
          atlantic : true,
          pacific : true
        },
        distances : {
          northAmerica : 0,
          asia : 3,
          europe : 3,
          africa : 2,
          australia : 4
        }
      },
      // Continent info for Asia
      asia : {
        name : 'Asia',
        budget : 500,
        hp : 1000,
        player : false,
        forces : {
          bombers : {
            declared : 0,
            total : 0
          },
          icbms : {
            declared : 0,
            total : 0
          }
        },
        oceans : {
          pacific : true,
          indian : true
        },
        distances : {
          northAmerica : 3,
          southAmerica : 3,
          europe : 0,
          africa : 1,
          australia : 1
        }
      },
      // Continent info for Europe.
      europe : {
        name : 'Europe',
        budget : 1100,
        hp : 400,
        player : false,
        forces : {
          bombers : {
            declared : 0,
            total : 0
          },
          icbms : {
            declared : 0,
            total : 0
          }
        },
        oceans : {
          atlantic : true
        },
        distances : {
          northAmerica : 2,
          southAmerica : 3,
          asia : 0,
          africa : 1,
          australia : 5
        }
      },
      // Continent info for Africa.
      africa : {
        name : 'Africa',
        budget : 600,
        hp : 900,
        player : false,
        forces : {
          bombers : {
            declared : 0,
            total : 0
          },
          icbms : {
            declared : 0,
            total : 0
          }
        },
        oceans : {
          atlantic : true,
          indian : true
        },
        distances : {
          northAmerica : 3,
          southAmerica : 2,
          asia : 1,
          europe : 1,
          australia : 3
        }
      },
      // Continent info for Australia.
      australia : {
        name : 'Australia',
        budget : 800,
        hp : 700,
        player : false,
        forces : {
          bombers : {
            declared : 0,
            total : 0
          },
          icbms : {
            declared : 0,
            total : 0
          }
        },
        oceans : {
          pacific : true,
          indian : true
        },
        distances : {
          northAmerica : 4,
          southAmerica : 4,
          asia : 1,
          europe : 5,
          africa : 3
        }
      }
    },
    // Ocean information.
    oceans : {
      atlantic : {
        name : 'Atlantic Ocean',
        subs : true,
        canHit : {
          northAmerica : true,
          southAmerica : true,
          africa : true,
          europe : true
        }
      },
      pacific : {
        name : 'Pacific Ocean',
        subs : true,
        canHit : {
          northAmerica : true,
          southAmerica : true,
          asia : true,
          australia : true
        }
      },
      indian : {
        name : 'Indian Ocean',
        subs : true,
        canHit : {
          africa : true,
          asia : true,
          australia : true
        }
      }
    }
  }); // End of gameInstanceRef.set
  ctx.body = { gameID : `game${gameID}`};
}); // end of the POST route for /pregame/setup

router.put('/joingame', async (ctx) => {
  console.log(ctx.request.body);
  let playerID = ctx.request.body.playerID;
  let gameRef = ref.child(ctx.request.body.gameID);
  let playersRef = gameRef.child(`/players`);

  await gameRef.once('value', (snap) => {
    if (snap.val()) {
      playersRef.once('value', (playersSnap) => {
        if (playersSnap.numChildren() < 6) {
          let playerObj = {};
          playerObj[playerID] = {
            totalDeclaredForces : 0,
            continents : true,
            oceans : true,
            rnd : {
              speed : 0,
              damage : 0
            },
            currentBudget : 0,
            yearComplete : false,
            shotsFired : 0,
            spyMessage : '',
          };
          playersRef.update(playerObj); // End of the playersRef update.
          ctx.status = 200;
        } else { // If the game is already has 6 players.
          ctx.status = 400;
          ctx.body = {
            message: 'Game is already full!',
          };
        } // End of conditional checking the number of players.
      }); // End of the firebase snap checking player values.
    } else { // If game ID is not valid.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID, or game has not yet started.',
      };
    }// End of conditional checking that game ID is valid.
  }); // end of the firebase once check.
}); // end of the '/joingame' route.

router.post('/startgame', async (ctx) => {
  // Starting the game once players have joined.
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let players = gameRef.child('players');

  await players.once('value', (snap) => {
    if (snap.val()) { // Making sure there is a game with the game ID.
      let playersArray = Object.keys(snap.val()); // Grab all the players.
      if (playersArray.length < 2) { // If there aren't enough players, send an error and don't start the game.
        ctx.status = 400;
        ctx.body = {
          message: 'Game cannot be started, not enough players have joined.',
        };
      } else { // If there are enough players, start the game.
        gameRef.update({
          gameStarted : true
        });
        ctx.status = 200;
        ctx.body = playersArray;
      } // End of the check for enough players conditional statement.
    } else { // If there is no game with that gameID...
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID.',
      };
    } // End of the verifying gameID exists conditional statement.
  }); // End of grabbing the single-view snap of data from Firebase.
}); // End of startgame route.


router.post('/continentselect', async (ctx) => {
  let playerID = ctx.request.body.playerID;
  let gameID = ctx.request.body.gameID;
  let continent = ctx.request.body.continent;

  let gameRef = ref.child(gameID);
  let player = gameRef.child(`players/${playerID}`);

  await gameRef.once('value', (snap) => {
    if (snap.val() && snap.val().gameStarted) { // Verifying that gameID is valid.
      if (snap.val().players[playerID]) { // Verifying that player is part of this game.
        if (!snap.val().continents[continent].player) { // Checking to see if continent is already assigned.
          let continentAssignObj = {};
          continentAssignObj[continent] = true;
          let playerAssignObj = {};
          playerAssignObj[playerID] = true;
          player.child(`continents`).update(continentAssignObj);

          let oceansArr = Object.keys(snap.val().continents[continent].oceans);
          oceansArr.forEach((ocean) => {
            let oceanSubsForPlayer = {};
            oceanSubsForPlayer[playerID] = {
              declared : 0,
              total : 0
            };
            gameRef.child(`oceans/${ocean}/subs`).update(oceanSubsForPlayer);
          });
          player.child(`oceans`).update(snap.val().continents[continent].oceans); // Adding the oceans player can access with this continent.
          gameRef.child(`continents/${continent}/player`).update(playerAssignObj);
          ctx.status = 200;
        } else {
          ctx.status = 400;
          ctx.body = {
            message: 'Continent has already been assigned.',
          };
        } // End of continent-already-assigned conditional.
      } else { // if player is not part of this game.
        ctx.status = 400;
        ctx.body = {
          message: 'PlayerID is not valid for this game.',
        };
      } // End of player verification conditional.
    } else { // If this game ID doesn't exist.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID, or game has not yet started.',
      };
    }// End of gameID/game start verification conditional.
  }) // End of the snapshot.
}); // End of the route.

router.post('/beginpeace', async (ctx) => {
  // Continent selection is done, "pleacetime" begins.
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);

  await gameRef.once('value', (snap) => {
    if (snap.val()) {
      gameRef.update({peacetime : true});
      let playersArray = Object.keys(snap.val().players);
      console.log('The players - ', playersArray);
      playersArray.forEach((player) => { // Going through each player...
        let currentBudget = {currentBudget : 0};
        let continentsArr = Object.keys(snap.val().players[player].continents); // Finding the continents they have assigned.
        continentsArr.forEach((continent) => { // Going through those continents...
          currentBudget.currentBudget += snap.val().continents[continent].budget; //...and adding the initial budget numbers.
        });
        gameRef.child(`players/${player}`).update(currentBudget); // ...and then add the budget to Firebase
      });
      ctx.status = 200;
    } else {
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID.',
      }
    }
  });
});


module.exports = router;
