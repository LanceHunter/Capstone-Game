'use strict';

// Firebase setup.
const admin = require("firebase-admin");
const firebase = admin.database();
const ref = firebase.ref('gameInstance');

// Getting Knex
const config = require('../knexfile')[process.env.ENV || 'development'];
const knex = require('knex')(config);

//Setting up express routing
const router = require('koa-router')();

router.prefix('/api/war');

router.put('/shot', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let targetID = ctx.request.body.targetID;
  let launchID = ctx.request.body.launchID;
  let shotType = ctx.request.body.shotType;
  let gameObj;
  let gameOver = true;

  await gameRef.once('value', (snap) => {
    gameObj = snap.val();
  }); // end of grabbing the info from Firebase.

  if (gameObj && gameObj.war) { // Checking if gameID is valid and that war was declared.
    if (shotType === 'bomber') { // If the type of shot is bomber.
      if (gameObj.continents[launchID].distances[targetID] <= 1 && gameObj.continents[launchID].forces.bombers.total > 0) {
        let player = Object.keys(gameObj.continents[launchID].player)[0];
        let updateBomberObj = {total : gameObj.continents[launchID].forces.bombers.total-1};
        let updateHpObj = {hp : gameObj.continents[targetID].hp - (50 + Math.floor(gameObj.players[player].rnd.damage/500)*5)};
        let shotsFired = gameObj.players[player].shotsFired + 1;
        await gameRef.child(`players/${playerID}`).update({shotsFired : shotsFired});
        await gameRef.child(`continents/${targetID}`).update(updateHpObj);
        await gameRef.child(`continents/${launchID}/forces/bombers`).update(updateBomberObj);
        ctx.status = 200;

        // Running the check to see if this is game over...
        let playerArr = Object.keys(gameObj.continents.players);
        playerArr.splice(playerArr.indexOf(playerID), 1);
        playerArr.forEach((enemy) => {
          // Check the enemy's continents to see if any have any HP left.
          let enemyContinents = Object.keys(gameObj.players[enemy].continents);
          enemyContinents.forEach((enemyContinent) => {
            if (gameObj.continents[enemyContinent].hp > 0) {
              gameOver = false;
            }
          });
          // Check the enemy subs to see if there are any left.
          let enemyOceans = Object.keys(gameObj.players[enemy].oceans);
          enemyOceans.forEach((enemyOcean) => {
            if (gameObj.oceans[enemyOcean].subs[enemyContinent].total > 0) {
              gameOver = false;
            }
          });
        }); // End of forEach through every enemy checking if the game is over.
      } else { // If target is too far for bomber to reach or if continent has no bombers available.\
        ctx.status = 400;
        ctx.body = {
          message: 'Target out of reach for bombers, or no bombers available.',
        };
      } // End of onditional checking if there are bombers available and if target is in range
    } else if (shotType === 'icbm') { // If the type of shot is ICBM.
      if (gameObj.continents[launchID].forces.icbms.total > 0) {
        let player = Object.keys(gameObj.continents[launchID].player)[0];
        let updateIcbmObj = {total : gameObj.continents[launchID].forces.icbms.total-1};
        let updateHpObj = {hp : gameObj.continents[targetID].hp - (50 + Math.floor(gameObj.players[player].rnd.damage/500)*5)};
        let shotsFired = gameObj.players[player].shotsFired + 1;
        await gameRef.child(`players/${playerID}`).update({shotsFired : shotsFired});
        await gameRef.child(`continents/${targetID}`).update(updateHpObj);
        await gameRef.child(`continents/${launchID}/forces/icbms`).update(updateIcbmObj);
        ctx.status = 200;

        // Running the check to see if this is game over...
        let playerArr = Object.keys(gameObj.continents.players);
        playerArr.splice(playerArr.indexOf(playerID), 1);
        playerArr.forEach((enemy) => {
          // Check the enemy's continents to see if any have any HP left.
          let enemyContinents = Object.keys(gameObj.players[enemy].continents);
          enemyContinents.forEach((enemyContinent) => {
            if (gameObj.continents[enemyContinent].hp > 0) {
              gameOver = false;
            }
          });
          // Check the enemy subs to see if there are any left.
          let enemyOceans = Object.keys(gameObj.players[enemy].oceans);
          enemyOceans.forEach((enemyOcean) => {
            if (gameObj.oceans[enemyOcean].subs[enemyContinent].total > 0) {
              gameOver = false;
            }
          });
        }); // End of forEach through every enemy checking if the game is over.

      } else { // If no ICBMs available.
        ctx.status = 400;
        ctx.body = {
          message: 'No ICBMs available from that location.',
        };
      } // End of conditional checking if ICBMs are avaialble.
    } else { // If the shot type is neither "bomber" or "icbm"
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid shot type.',
      };
    }
  } else { // If gameID is not valid of if war was not declared.
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid Game ID or war has not been declared.',
    };
  } // end of conditional checking if gameID is valid.

  // We've set context for our reply, but now we're gonna check to see if the game is over.

  if (gameOver) {

  }

}); // end of the "shot" route.


router.put('/subshot', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let targetID = ctx.request.body.targetID;
  let launchID = ctx.request.body.launchID;
  let shooterID = ctx.request.body.shooterID;

  await gameRef.once('value', (snap) => {
    if (snap.val() && snap.val().war) { // Checking if gameID is valid.
      if (snap.val().continents[targetID].oceans[launchID] && snap.val().oceans[launchID].subs[shooterID].total > 0) {
        let subsTotal = snap.val().oceans[launchID].subs[shooterID].total - 1;
        let updateHpObj = {hp : snap.val().continents[targetID].hp - (50 + Math.floor(snap.val().players[shooterID].rnd.damage/500)*5)};
        let shotsFired = snap.val().players[shooterID].shotsFired + 1;
        gameRef.child(`players/${shooterID}`).update({shotsFired : shotsFired});
        gameRef.child(`continents/${targetID}`).update(updateHpObj);
        gameRef.child(`oceans/${launchID}/subs/${shooterID}`).update({total:subsTotal});
        ctx.status = 200;
      } else { // If target location is not valid and that there are enough subs.
        ctx.status = 400;
        ctx.body = {
          message: 'Target cannot be reached from subs in that ocean, or insufficient sub missiles available.',
        };
      } // end of conditional checking if target location is valid and that there are enough subs.
    } else { // If gameID is not valid of if war was not declared.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid Game ID or war has not been declared.',
      };
    } // end of conditional checking if gameID is valid.
  }); // end of grabbing the info from Firebase.
}); // end of "subshot" route





module.exports = router;
