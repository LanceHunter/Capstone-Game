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
  console.log('We are in the shot.')
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

    // An array of all the players.
    let playerArr = Object.keys(gameObj.players);
    let player = Object.keys(gameObj.continents[launchID].player)[0];
    // An array of all the enemy players. (Everybody except this player.)
    let enemyPlayerArr = playerArr.splice(0);
    enemyPlayerArr.splice(enemyPlayerArr.indexOf(player), 1);


    if (shotType === 'bomber') { // If the type of shot is bomber.
      if (gameObj.continents[launchID].distances[targetID] <= 1 && gameObj.continents[launchID].forces.bombers.total > 0) {

        let updateBomberObj = {total : gameObj.continents[launchID].forces.bombers.total-1};
        let updateHpObj = {hp : gameObj.continents[targetID].hp - (50 + Math.floor(gameObj.players[player].rnd.damage/500)*5)};
        let shotsFired = gameObj.players[player].shotsFired + 1;
        await gameRef.child(`players/${player}`).update({shotsFired : shotsFired});
        await gameRef.child(`continents/${targetID}`).update(updateHpObj);
        await gameRef.child(`continents/${launchID}/forces/bombers`).update(updateBomberObj);
        ctx.status = 200;

        // Running the check to see if this is game over...
        enemyPlayerArr.forEach((enemy) => {
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
        let updateIcbmObj = {total : gameObj.continents[launchID].forces.icbms.total-1};
        let updateHpObj = {hp : gameObj.continents[targetID].hp - (50 + Math.floor(gameObj.players[player].rnd.damage/500)*5)};
        let shotsFired = gameObj.players[player].shotsFired + 1;
        await gameRef.child(`players/${player}`).update({shotsFired : shotsFired});
        await gameRef.child(`continents/${targetID}`).update(updateHpObj);
        await gameRef.child(`continents/${launchID}/forces/icbms`).update(updateIcbmObj);
        ctx.status = 200;

        // Running the check to see if this is game over...
        enemyPlayerArr.forEach((enemy) => {
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
            if (gameObj.oceans[enemyOcean].subs[enemy].total > 0) {
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

  // If the game is over, we end game and start writing to database.
  if (gameOver) {
    await gameRef.once('value', (snap) => {
      gameObj = snap.val();
    }); // end of grabbing the info from Firebase one more time in case there were cross-fire shots that caused everyone to lose.
    let warWon = false;
    let remainingHP = 0;
    let playerContinents = Object.keys(gameObj.players[player].continents);
    playerContinents.forEach((continent) => {
      if (gameObj.continents[continent].hp > 0) {
        warWon = true;
        remainingHP += gameObj.continents[continent].hp;
      }
    }); // end of the forEach checking player's continents for HP.
    if (warWon) { // Checking if player actually won the war.
      gameRef.update({gameOver : {type: 'warWon', winner: player}});
      let enemyTableInfo = await knex.select('*').from('users').whereIn('username', enemyPlayerArr);
      let playerTableInfo = await knex.select('*').from('users').whereIn('username', player);
      let gameIDforDB = await knex('games').returning('id').insert({outcome : 'warWon'});

      // Here is where we map the enemy player info to write to player DB.
      let enemiesDatabaseWrite = enemyTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage/500);
        return {
          user_id : entry.id,
          game_id : gameIDforDB[0],
          won : false,
          hit_points : 0,
          score : 0,
          shots : gameObj.players[(entry.username)].shotsFired,
          rnd_multiplier : rndMultiplier
        };
      });
      // And here is where we write the enemy player info to DB.
      await knex('players').insert(enemiesDatabaseWrite);

      let winnerHitPoints = 0;
      let playerDatabaseWrite = playerTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage/500);
        playerContinents.forEach((continent) => {
          winnerHitPoints += gameObj.continents[continent].hp;
        });
        return {
          user_id : entry.id,
          game_id : gameIDforDB[0],
          won : true,
          hit_points : winnerHitPoints,
          score : winnerHitPoints,
          shots : 0,
          rnd_multiplier : rndMultiplier
        };
      });
      // And here is where we write the winning player info to DB.
      await knex('players').insert(playerDatabaseWrite);
      // Then we increase the enemy's losses by 1.
      await knex('users').whereIn('username', enemyPlayerArr).increment('losses', 1);
      // While increasing the player's wins by 1.
      await knex('users').where('username', player).increment('wins', 1);


      if (enemyPlayerArr.length + 1 === 2) { // If we have two players in the game, updating info for two players.
        // let firstPlayerInfo = userTableInfo.filter((entry) => {
        //   return entry.username === playersArr[0];
        // });
        let updatePlayerOne = {
          average_score : (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score) + winnerHitPoints) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };
        if (playerTableInfo[0].high_score < winnerHitPoints) {
          updatePlayerOne.high_score = winnerHitPoints;
        }
        let updatePlayerTwo = {
          average_score : (((enemyTableInfo[0].wins + enemyTableInfo[0].losses) * enemyTableInfo[0].average_score)) / (enemyTableInfo[0].wins + enemyTableInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);

      } else if (enemyPlayerArr.length + 1 === 3) { // If we have three players in the game, updating info for three players.

        let updatePlayerOne = {
          average_score : (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score) + winnerHitPoints) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };
        if (playerTableInfo[0].high_score < winnerHitPoints) {
          updatePlayerOne.high_score = winnerHitPoints;
        }

        let secondPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[0];
        });
        let updatePlayerTwo = {
          average_score : ((secondPlayerInfo[0].wins + secondPlayerInfo[0].losses) * secondPlayerInfo[0].average_score) / (secondPlayerInfo[0].wins + secondPlayerInfo[0].losses + 1)
        };
        let thirdPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[1];
        });
        let updatePlayerThree = {
          average_score : ((thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses) * thirdPlayerInfo[0].average_score) / (thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);
        await knex('users').where('username', enemyPlayerArr[1]).update(updatePlayerThree);
      } // End of conditional checking if there are 2 or 3 players in the game.

    } else { // If the game is over but everyone was destroyed.

      gameRef.update({gameOver : {type: 'destroyed', winner: 'none'}});
      let enemyTableInfo = await knex.select('*').from('users').whereIn('username', enemyPlayerArr);
      let playerTableInfo = await knex.select('*').from('users').whereIn('username', player);
      let gameIDforDB = await knex('games').returning('id').insert({outcome : 'destroyed'});

      // Here is where we map the enemy player info to write to player DB.
      let enemiesDatabaseWrite = enemyTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage/500);
        return {
          user_id : entry.id,
          game_id : gameIDforDB[0],
          won : false,
          hit_points : 0,
          score : 0,
          shots : gameObj.players[(entry.username)].shotsFired,
          rnd_multiplier : rndMultiplier
        };
      });
      // And here is where we write the enemy player info to DB.
      await knex('players').insert(enemiesDatabaseWrite);

      let playerDatabaseWrite = playerTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage/500);
        playerContinents.forEach((continent) => {
          winnerHitPoints += gameObj.continents[continent].hp;
        });
        return {
          user_id : entry.id,
          game_id : gameIDforDB[0],
          won : false,
          hit_points : 0,
          score : 0,
          shots : 0,
          rnd_multiplier : rndMultiplier
        };
      });
      // And here is where we write the winning player info to DB.
      await knex('players').insert(playerDatabaseWrite);
      // Then we increase the enemy's losses by 1.
      await knex('users').whereIn('username', enemyPlayerArr).increment('losses', 1);
      // While increasing the player's wins by 1.
      await knex('users').where('username', player).increment('losses', 1);


      if (enemyPlayerArr.length + 1 === 2) { // If we have two players in the game, updating info for two players.
        // let firstPlayerInfo = userTableInfo.filter((entry) => {
        //   return entry.username === playersArr[0];
        // });
        let updatePlayerOne = {
          average_score : (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score)) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };
        let updatePlayerTwo = {
          average_score : (((enemyTableInfo[0].wins + enemyTableInfo[0].losses) * enemyTableInfo[0].average_score)) / (enemyTableInfo[0].wins + enemyTableInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);

      } else if (enemyPlayerArr.length + 1 === 3) { // If we have three players in the game, updating info for three players.

        let updatePlayerOne = {
          average_score : (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score)) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };

        let secondPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[0];
        });
        let updatePlayerTwo = {
          average_score : ((secondPlayerInfo[0].wins + secondPlayerInfo[0].losses) * secondPlayerInfo[0].average_score) / (secondPlayerInfo[0].wins + secondPlayerInfo[0].losses + 1)
        };
        let thirdPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[1];
        });
        let updatePlayerThree = {
          average_score : ((thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses) * thirdPlayerInfo[0].average_score) / (thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);
        await knex('users').where('username', enemyPlayerArr[1]).update(updatePlayerThree);
      } // End of conditional checking if there are 2 or 3 players in the game.

    } // end of conditional checking if game was won or if everyone lost.
  } // end of conditional checking if we are in a gameOver state.

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
