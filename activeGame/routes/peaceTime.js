'use strict';

// Firebase setup.
const admin = require("firebase-admin");
const firebase = admin.database();
const ref = firebase.ref('gameInstance');


//Setting up express routing
const express = require('express');
const router = express.Router();

// Setting up variables for deploy and maintinence costs, so we can chance them in a single place instead of everywhere.
const subMaint = 20;
const icbmMaint = 20;
const bomberMaint = 10;
const subCost = 200;
const icbmCost = 100;
const bomberCost = 50;

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


        /// Here is where we see if there are no weapons on earth at all.
        let yearsWithNoWeapons = snap.val().yearsWithNoWeapons + 1;
        let allContinentsArr = Object.keys(snap.val().continents);
        let allOceansArr = Object.keys(snap.val().oceans);

        allContinentsArr.forEach((continent) => {
          if (snap.val().continents[continent].forces.bombers.total > 0 || snap.val().continents[continent].forces.icbms.total > 0) {
            yearsWithNoWeapons = 0;
          }
        }); // End of checking all continents for weapons.

        allOceansArr.forEach((ocean) => {
          let playerSubsArr = Object.keys(snap.val().oceans[ocean].subs);
          playerSubsArr.forEach((playerInOcean) => {
            if (snap.val().oceans[ocean].subs[playerInOcean].total > 0) {
              yearsWithNoWeapons = 0;
            }
          });
        }); // End of checking all oceans for weapons.
        gameRef.update({yearsWithNoWeapons : yearsWithNoWeapons}); // Finally, updating yearsWithNoWeapons in Firebase.

        //// NEED TO INSERT SPY MESSAGES/STEALTH ROLLS HERE!!!

        res.sendStatus(200);
        res.end();
      } else { // If not all players have marked the year as complete.
        res.sendStatus(200);
        res.end();
      } // End of conditional checking to see if all players have marked the year as complete.
    } else { // If game ID isn't valid or player already ended this year.
      res.send('Invalid game ID entered or year already ended for this player.');
      res.end();
    } // end of coditional checking if game ID is valid.
  }); // end of grab of firebase data for game.
}); // end of "yearcomplete" route

router.post('/deploybomber', (req, res) => {
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = req.body.playerID;
  let quantity = req.body.quantity;
  let location = req.body.location;

  gameRef.once('value', (snap) => {
    if (snap.val()) {
      if (snap.val().players[playerID].currentBudget >= bomberCost) {

      } else {
        res.send('Insufficient funds to deploy a bomber.');
        res.end();
      }
    } else { // If gameID isn't found.
    res.send('Invalid game ID entered or year already ended for this player.');
    res.end();
    } // end of coditional checking if game ID is valid.
  }); // end of single-grab of firebase data.

}); // end of "deploybomber" route



module.exports = router;
