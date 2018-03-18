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
          gameRef.child(`players/${player}`).update({yearComplete : false});
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

router.put('/deploybomber', (req, res) => {
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = req.body.playerID;
  let quantity = req.body.quantity;
  let location = req.body.location;

  gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].currentBudget >= bomberCost * quantity && snap.val().players[playerID].continents[location]) {
        let bombers = snap.val().continents[location].forces.bombers.total + quantity;
        let currentBudget = snap.val().players[playerID].currentBudget - (bomberCost * quantity);
        gameRef.child(`players/${playerID}`).update({currentBudget : currentBudget});
        gameRef.child(`continents/${location}/forces/bombers`).update({total : bombers});
        res.sendStatus(200);
      } else { // If the player doesn't have enough funds or is trying to put them on a continent they don't own.
        res.send('Insufficient funds to deploy or invalid location.');
        res.end();
      } // End of budget/location conditional.
    } else { // If gameID isn't found.
    res.send('Invalid game ID entered or was were declared.');
    res.end();
    } // end of coditional checking if game ID is valid.
  }); // end of single-grab of firebase data.
}); // end of "deploybomber" route

router.put('/deployicbm', (req, res) => {
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = req.body.playerID;
  let quantity = req.body.quantity;
  let location = req.body.location;

  gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].currentBudget >= icbmCost * quantity && snap.val().players[playerID].continents[location]) {
        let icbms = snap.val().continents[location].forces.icbms.total + quantity;
        let currentBudget = snap.val().players[playerID].currentBudget - (icbmCost * quantity);
        gameRef.child(`players/${playerID}`).update({currentBudget : currentBudget});
        gameRef.child(`continents/${location}/forces/icbms`).update({total : icbms});
        res.sendStatus(200);
      } else { // If the player doesn't have enough funds or is trying to put them on a continent they don't own.
        res.send('Insufficient funds to deploy or invalid location.');
        res.end();
      } // End of budget/location conditional.
    } else { // If gameID isn't found.
    res.send('Invalid game ID entered or war were declared.');
    res.end();
    } // end of coditional checking if game ID is valid.
  }); // end of single-grab of firebase data.
}); // end of "deployicbm" route


router.put('/deploysub', (req, res) => {
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = req.body.playerID;
  let quantity = req.body.quantity;
  let location = req.body.location;

  gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].currentBudget >= subCost * quantity && snap.val().players[playerID].oceans[location]) {
        let subs = snap.val().oceans[location].subs[playerID].total + quantity;
        let currentBudget = snap.val().players[playerID].currentBudget - (subCost * quantity);
        gameRef.child(`players/${playerID}`).update({currentBudget : currentBudget});
        gameRef.child(`oceans/${location}/subs/${playerID}`).update({total : subs});
        res.sendStatus(200);
      } else { // If the player doesn't have enough funds or is trying to put them on a continent they don't own.
        res.send('Insufficient funds to deploy or invalid location.');
        res.end();
      } // End of budget/location conditional.
    } else { // If gameID isn't found.
    res.send('Invalid game ID entered or war were declared.');
    res.end();
    } // end of coditional checking if game ID is valid.
  }); // end of single-grab of firebase data.
}); // end of "deploysub" route

router.put('/declarebomber', (req, res) => {
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = req.body.playerID;
  let quantity = req.body.quantity;
  let location = req.body.location;

  gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].continents[location] && snap.val().continents[location].forces.bombers.declared + quantity <= snap.val().continents[location].forces.bombers.total) {
        let declaredNum = snap.val().continents[location].forces.bombers.declared + quantity;
        gameRef.child(`continents/${location}/forces/bombers`).update({declared : declaredNum});
        let totalDeclared = snap.val().players[playerID].totalDeclaredForces + quantity;
        gameRef.child(`players/${playerID}`).update({totalDeclaredForces : totalDeclared});
        res.sendStatus(200);
        res.end();
      } else { //If continent doesn't belong to player or they are trying to delcare more bombers than their current total.
        res.send('Invalid location or amount to delcare would have brought declared total higher than total amount of forces.')
        res.end();
      } // End of conditional checking on location and declared vs. total.
    } else { // If war were delcared or game ID was invalid.
      res.send('Invalid game ID entered or war were declared.');
      res.end();
    } // End of conditional checking game ID and if war were declared.
  }); // end of single-grab of firebase data.
}); // End of the "declarebomber" route.

router.put('/declareicbm', (req, res) => {
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = req.body.playerID;
  let quantity = req.body.quantity;
  let location = req.body.location;

  gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].continents[location] && snap.val().continents[location].forces.icbms.declared + quantity <= snap.val().continents[location].forces.icbms.total) {
        let declaredNum = snap.val().continents[location].forces.icbms.declared + quantity;
        gameRef.child(`continents/${location}/forces/icbms`).update({declared : declaredNum});
        let totalDeclared = snap.val().players[playerID].totalDeclaredForces + quantity;
        gameRef.child(`players/${playerID}`).update({totalDeclaredForces : totalDeclared});
        res.sendStatus(200);
        res.end();
      } else { //If continent doesn't belong to player or they are trying to delcare more bombers than their current total.
        res.send('Invalid location or amount to delcare would have brought declared total higher than total amount of forces.')
        res.end();
      } // End of conditional checking on location and declared vs. total.
    } else { // If war were delcared or game ID was invalid.
      res.send('Invalid game ID entered or war were declared.');
      res.end();
    } // End of conditional checking game ID and if war were declared.
  }); // end of single-grab of firebase data.
}); // End of the "declareicbms" route.


router.put('/declaresub', (req, res) => {
  let gameID = req.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = req.body.playerID;
  let quantity = req.body.quantity;
  let location = req.body.location;

  gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].oceans[location] && snap.val().oceans[location].subs[playerID].declared + quantity <= snap.val().oceans[location].subs[playerID].total) {
        let declaredNum = snap.val().oceans[location].subs[playerID].declared + quantity;
        gameRef.child(`oceans/${location}/subs/${playerID}`).update({declared : declaredNum});
        let totalDeclared = snap.val().players[playerID].totalDeclaredForces + quantity;
        gameRef.child(`players/${playerID}`).update({totalDeclaredForces : totalDeclared});
        res.sendStatus(200);
        res.end();
      } else { //If continent doesn't belong to player or they are trying to delcare more bombers than their current total.
        res.send('Invalid location or amount to delcare would have brought declared total higher than total amount of forces.')
        res.end();
      } // End of conditional checking on location and declared vs. total.
    } else { // If war were delcared or game ID was invalid.
      res.send('Invalid game ID entered or war were declared.');
      res.end();
    } // End of conditional checking game ID and if war were declared.
  }); // end of single-grab of firebase data.
}); // End of the "declaresubs" route.




module.exports = router;
