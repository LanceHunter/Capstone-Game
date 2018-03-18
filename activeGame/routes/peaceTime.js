'use strict';

// Firebase setup.
const admin = require("firebase-admin");
const firebase = admin.database();
const ref = firebase.ref('gameInstance');


//Setting up express routing
const express = require('express');
const router = express.Router();

// Setting up variables for maintinence costs, so we can chance them in a single place instead of everywhere.
const subMaint = 20;
const icbmMaint = 20;
const bomberMaint = 10;

router.post('/yearcomplete', (req, res) => {
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = req.body.playerID;
  let allComplete = true;
  gameRef.once('value', (snap) => {
    if (snap.val() && !(snap.val().players[playerID].yearComplete)) { // Verifying that game ID is valid and that player hasn't double-ended year.
      gameRef.child(`players/${playerID}`).update({yearComplete: true});
      let playersArr = Object.keys(snap.val().players);

      playersArr.forEach((player) => {
        if (player !== playerID && !snap.val().players[player].yearComplete) {
          allComplete = false;
        }
      });

      if (allComplete) {
        console.log(`They're all complete, time for next year!`);
        let newYear = snap.val().year + 1;
        console.log('The new year is - ', newYear);
        gameRef.update({year : newYear}); // Updating the year.
        playersArr.forEach((player) => {
          let nextYearBudget = 0;
          let myContinentsArr = Object.keys(snap.val().players[player].continents);
          myContinentsArr.forEach((continent) => {
            nextYearBudget += snap.val().continents[continent].budget;
            nextYearBudget -= snap.val().continents[continent].forces.bombers.total * bomberMaint;
            nextYearBudget -= snap.val().continents[continent].forces.icbms.total * icbmMaint;
          }); // End of checking each continent.
          let myOceansArr = Object.keys(snap.val().players[player].oceans);
          myOceansArr.forEach((ocean) => {
            nextYearBudget -= snap.val().oceans[ocean].subs[player].total * subMaint;
          }); // End of checking each ocean.
          gameRef.child(`players/${player}`).update({currentBudget : nextYearBudget});
        }); // End of setting the new budget for each player.

        res.sendStatus(200);
        res.end();
      } else {
        res.sendStatus(200);
        res.end();
      }

    } else { // If game ID isn't valid or player already ended this year.
      res.send('Invalid game ID entered or year already ended for this player.');
      res.end();
    } // end of coditional checking if game ID is valid.
  }); // end of grab of firebase data for game.
}); // end of "yearcomplete" route



module.exports = router;
