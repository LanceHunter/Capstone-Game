'use strict';

// Firebase setup.
const admin = require("firebase-admin");
const serviceAccount = require('../globalthermonuclearwargame-firebase-adminsdk-mcs5b-ec18bb03a7.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASEURL
});

const firebase = admin.database();
const ref = firebase.ref('gameInstance');

//Setting up express routing
const express = require('express');
const router = express.Router();


router.post('/setup', (req, res) => {
  // Will need some form of verification to make sure we've got a valid board.
  let gameID = Math.floor(Math.random()*10000);
  let gameInstanceRef = ref.child(`game${gameID}`);
  gameInstanceRef.set({
    year : 1950,
    gameStarted : false, // For when a game has moved past player entry and into the "choose continents" phase..
    peacetime : false,// Pushing this to firebase so all devices know when continent is over and peacetime begins.
    war : false, // Pushing this to firebase so all devices know war has started.
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
            deployed : 0,
            total : 0
          },
          icbms : {
            deployed : 0,
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
            deployed : 0,
            total : 0
          },
          icbms : {
            deployed : 0,
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
            deployed : 0,
            total : 0
          },
          icbms : {
            deployed : 0,
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
            deployed : 0,
            total : 0
          },
          icbms : {
            deployed : 0,
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
            deployed : 0,
            total : 0
          },
          icbms : {
            deployed : 0,
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
            deployed : 0,
            total : 0
          },
          icbms : {
            deployed : 0,
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
        subs : true,
        canHit : {
          northAmerica : true,
          southAmerica : true,
          africa : true,
          europe : true
        }
      },
      pacific : {
        subs : true,
        canHit : {
          northAmerica : true,
          southAmerica : true,
          asia : true,
          australia : true
        }
      },
      indian : {
        subs : true,
        canHit : {
          africa : true,
          asia : true,
          australia : true
        }
      }
    }
  }); // End of gameInstanceRef.set
  res.json({ gameID : `game${gameID}`});
  res.end();
}); // end of the POST route for /pregame/setup

router.put('/joingame', (req, res) => {
  console.log(req.body);
  let playerID = req.body.playerID;
  let gameRef = ref.child(req.body.gameID);
  let playersRef = gameRef.child(`/players`);

  gameRef.once('value', (snap) => {
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
            spyMessage : '',
          };
          playersRef.update(playerObj); // End of the playersRef update.
          res.sendStatus(200);
          res.end();
        } else { // If the game is already has 6 players.
          res.send('Game is already full!');
          res.end();
        } // End of conditional checking the number of players.
      }); // End of the firebase snap checking player values.
    } else { // If game ID is not valid.
      res.send('Invalid game ID, or game has not yet started.');
      res.end();
    }// End of conditional checking that game ID is valid.
  }); // end of the firebase once check.
}); // end of the '/joingame' route.

router.post('/startgame', (req, res) => { // Starting the game once players have joined.
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);
  let players = gameRef.child('players');

  players.once('value', (snap) => {
    if (snap.val()) { // Making sure there is a game with the game ID.
      let playersArray = Object.keys(snap.val()); // Grab all the players.
      if (playersArray.length < 2) { // If there aren't enough players, send an error and don't start the game.
        res.send('Game cannot be started, not enough players have joined.');
        res.end();
      } else { // If there are enough players, start the game.
        gameRef.update({
          gameStarted : true
        });
        res.json(playersArray);
        res.end();
      } // End of the check for enough players conditional statement.
    } else { // If there is no game with that gameID...
      res.send('Invalid game ID.');
      res.end();
    } // End of the verifying gameID exists conditional statement.
  }); // End of grabbing the single-view snap of data from Firebase.
}); // End of startgame route.


router.post('/continentselect', (req, res) => {
  let playerID = req.body.playerID;
  let gameID = req.body.gameID;
  let continent = req.body.continent;

  let gameRef = ref.child(gameID);
  let player = gameRef.child(`players/${playerID}`);

  gameRef.once('value', (snap) => {
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
              deployed : 0,
              total : 0
            };
            gameRef.child(`oceans/${ocean}/subs`).update(oceanSubsForPlayer);
          });
          player.child(`oceans`).update(snap.val().continents[continent].oceans); // Adding the oceans player can access with this continent.
          gameRef.child(`continents/${continent}/player`).update(playerAssignObj);
          res.sendStatus(200);
          res.end();
        } else {
          res.send('Continent has already been assigned.');
          res.end();
        } // End of continent-already-assigned conditional.
      } else { // if player is not part of this game.
        res.send('PlayerID is not valid for this game.');
        res.end();
      } // End of player verification conditional.
    } else { // If this game ID doesn't exist.
      res.send('Invalid game ID, or game has not yet started.');
      res.end();
    }// End of gameID/game start verification conditional.
  }) // End of the snapshot.
}); // End of the route.

router.post('/beginpeace', (req, res) => { // Continent selection is done, "pleacetime" begins.
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);

  gameRef.once('value', (snap) => {
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
      res.sendStatus(200);
      res.end();
    } else {
      res.send('Invalid game ID.');
      res.end();
    }
  });
});


module.exports = router;
