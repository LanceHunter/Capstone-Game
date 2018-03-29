'use strict';

// Firebase setup.
const admin = require("firebase-admin");
const serviceAccount = require('../../private/gtwthegame-firebase-adminsdk-xemv3-858ad1023b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gtwthegame.firebaseio.com"
});

const firebase = admin.database();
const ref = firebase.ref('gameInstance');

//Setting up express routing
const router = require('koa-router')();

router.prefix('/api/pregame');

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
  let gameObj;

  await gameRef.once('value', (snap) => {
    gameObj = snap.val();
  }); // end of the firebase once check.


  if (gameObj && !gameObj.gameStarted) {
    if (gameObj.players) { // checking to see if there's a 'players' node yet.
      if (Object.keys(gameObj.players).length < 3) {
        let playerObj = {};
        playerObj[playerID] = {
          totalDeclaredForces : 0,
          totalForces : 0,
          totalBombers : 0,
          totalICBMs : 0,
          totalSubs : 0,
          continents : false,
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
        console.log('Setting ctx-status');
        ctx.status = 200;
      } else { // If the game is already has 3 players.
        ctx.status = 400;
        ctx.body = {
          message: 'Game is already full!',
        };
      } // End of conditional checking the number of players.
    } else { // if there is no player node
      let playerObj = {};
      playerObj[playerID] = {
        totalDeclaredForces : 0,
        totalForces : 0,
        totalBombers : 0,
        totalICBMs : 0,
        totalSubs : 0,
        continents : false,
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
      await playersRef.update(playerObj); // End of the playersRef update.
      console.log('Setting ctx-status');
      ctx.status = 200;
    } // end of conditional checking if there is a player node.
  } else { // If game ID is not valid.
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid game ID, or game has not yet started.',
    };
  }// End of conditional checking that game ID is valid.

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
  let gameObj;

  await gameRef.once('value', (snap) => {
    gameObj = snap.val();
  }); // End of the snapshot.

  let totalPlayers = Object.keys(gameObj.players).length;
  console.log('The totalPlayers - ', totalPlayers);

  if (gameObj && gameObj.gameStarted) { // Verifying that gameID is valid.
    if (gameObj.players[playerID]) { // Verifying that player is part of this game.
      if (!gameObj.players[playerID].continents) { // Checking to see if the player has no continents yet.
        if (!gameObj.continents[continent].player) { // Checking to see if continent is already assigned.
          let continentAssignObj = {};
          continentAssignObj[continent] = true;
          let playerAssignObj = {};
          playerAssignObj[playerID] = true;
          player.child(`continents`).update(continentAssignObj);

          let oceansArr = Object.keys(gameObj.continents[continent].oceans);
          oceansArr.forEach((ocean) => {
            let oceanSubsForPlayer = {};
            oceanSubsForPlayer[playerID] = {
              declared : 0,
              total : 0
            };
            gameRef.child(`oceans/${ocean}/subs`).update(oceanSubsForPlayer);
          });
          player.child(`oceans`).update(gameObj.continents[continent].oceans); // Adding the oceans player can access with this continent.
          gameRef.child(`continents/${continent}/player`).update(playerAssignObj);
          ctx.status = 200;
        } else {
          ctx.status = 400;
          ctx.body = {
            message: 'Continent has already been assigned.',
          };
        } // End of continent-already-assigned conditional.
      } else if (Object.keys(gameObj.players[playerID].continents).length * totalPlayers < 6) { // If the player has continents, making sure they don't have more than their share.
        console.log('We are here - Object.keys(gameObj.players[playerID].continents).length * totalPlayers <= 6 - ', Object.keys(gameObj.players[playerID].continents).length * totalPlayers);
        if (!gameObj.continents[continent].player) { // Checking to see if continent is already assigned.
          let continentAssignObj = {};
          continentAssignObj[continent] = true;
          let playerAssignObj = {};
          playerAssignObj[playerID] = true;
          player.child(`continents`).update(continentAssignObj);

          let oceansArr = Object.keys(gameObj.continents[continent].oceans);
          oceansArr.forEach((ocean) => {
            let oceanSubsForPlayer = {};
            oceanSubsForPlayer[playerID] = {
              declared : 0,
              total : 0
            };
            gameRef.child(`oceans/${ocean}/subs`).update(oceanSubsForPlayer);
          });
          player.child(`oceans`).update(gameObj.continents[continent].oceans); // Adding the oceans player can access with this continent.
          gameRef.child(`continents/${continent}/player`).update(playerAssignObj);
          ctx.status = 200;
        } else {
          ctx.status = 400;
          ctx.body = {
            message: 'Continent has already been assigned.',
          };
        } // End of continent-already-assigned conditional.

      } else {
        console.log('We are NOT here - Object.keys(gameObj.players[playerID].continents).length * totalPlayers <= 6 - ', Object.keys(gameObj.players[playerID].continents).length * totalPlayers);
        ctx.status = 400;
        ctx.body = {
          message: 'Player has max nuber of continents.',
        };
      }
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
}); // end of the "beginpeace" route.

/* We don't need these seed routes anymore (and we are no longer including FS so they wouldn't work anyway). Keeping the code here as reference for the future.

/// Here is a "seed" route, that's gonna grab a game and save the object to a file for use. DELETE THIS BEFORE DEPLOYING.
router.post('/makeseed', async (ctx) => {
  let gameObjJSON;
  let gameID = ctx.request.body.gameID;
  let fileName = ctx.request.body.fileName;
  let gameRef = ref.child(gameID);
  // Grab the game data.
  await gameRef.once('value', (snap) => {
    gameObjJSON = JSON.stringify(snap.val());
  });
  // Write it to a file.
  await fs.writeFile(`${fileName}`, gameObjJSON);
  // Tell ctx that it worked. (Not gonna do a lot of error-checking here because this is mostly for me.)
  ctx.status = 200;
});

/// The other "seed" route, that's gonna pass a seed game object into Firebase for testing purposes. DELETE THIS BEFORE DEPLOYING.
router.post('/runseed', async (ctx) => {
  console.log('This is here.');
  let fileName = ctx.request.body.fileName;
  let seedGameName = ctx.request.body.seedGameName;
  let gameObj;
  console.log('fileName - ', fileName);
  console.log('seedGameName - ', seedGameName);
  await fs.readFile(`./${fileName}`, (err, data) => {
    gameObj = JSON.parse(data);
    ref.child(seedGameName).update(gameObj);
  });
  // Tell ctx that it worked. (Not gonna do a lot of error-checking here because this is mostly for me.)
  ctx.status = 200;
});
End of those routes we're commenting out... */

module.exports = router;
