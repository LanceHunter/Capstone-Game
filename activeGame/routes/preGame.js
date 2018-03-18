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
    gameStarted : false, // Pushing this to firebase so all devices know when continent selection is over.
    war : false, // Pushing this to firebase so all devices know war has started.
    continents : {
      // Continent info for North America.
      northAmerica : {
        budget : 1000,
        hp : 500,
        player : {
          name : null
        },
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
        budget : 750,
        hp : 750,
        player : {
          name : null
        },
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
        budget : 500,
        hp : 1000,
        player : {
          name : null
        },
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
        budget : 1100,
        hp : 400,
        player : {
          name : null
        },
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
        budget : 600,
        hp : 900,
        player : {
          name : null
        },
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
        budget : 800,
        hp : 700,
        player : {
          name : null
        },
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

router.post('/joingame', (req, res) => {
  console.log(req.body);
  let playerID = req.body.playerID;
  let playersRef = ref.child(`${req.body.gameID}/players`);
  playersRef.once('value', (snap) => {
    if (snap.numChildren() < 6) {
      let playerObj = {};
      playerObj[playerID] = {
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
    } else {
      res.send('Game is already full!');
      res.end();
    }
  });
});

router.post('/startgame', (req, res) => {
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);
  let players = gameRef.child('players');

  players.once('value', (snap) => {
    if (snap.val()) { // Making sure there is a game with the game ID.
      let playersArray = Object.keys(snap.val());
      if (playersArray.length < 2) {
        res.send('Game cannot be started, not enough players have joined.');
        res.end();
      } else {
        gameRef.update({
          gameStarted : true
        });
        res.json(playersArray);
        res.end();
      }
    } else {
      res.send('Invalid game ID.');
      res.end();
    }
  });
});


module.exports = router;
