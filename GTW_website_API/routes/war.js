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

// Telling koa the prefix for this route.
router.prefix('/api/war');


// This is the route for an ICBM or Bomber shot.
router.put('/shot', async (ctx) => {
  let gameID = ctx.request.body.gameID; // The ID for this game instance.
  let gameRef = ref.child(gameID); // Referencing this game in the database.
  let targetID = ctx.request.body.targetID; // The target continent.
  let launchID = ctx.request.body.launchID; // The launching continent.
  let shotType = ctx.request.body.shotType; // The type of shot ('icbm' or 'bomber')
  let gameObj; // The variable that will hold gameobject data, put here to scope outside of the data grab.
  let gameOver = true; // Boolean checking if game is over.
  let rubbleLoss = true; // Boolean checking if game was a rubble loss.

  await gameRef.once('value', (snap) => {
    gameObj = snap.val();
  }); // Grabbing the game object/info from Firebase.

  // Below we get an array of all the players.
  let playerArr = Object.keys(gameObj.players);
  let player = Object.keys(gameObj.continents[launchID].player)[0];

  // Below we get an array of all the enemy players. (Everybody except the player firing this shot.)
  let enemyPlayerArr = playerArr.slice(0);
  enemyPlayerArr.splice(enemyPlayerArr.indexOf(player), 1);

  // An array of the player's continents.
  let playerContinents = Object.keys(gameObj.players[player].continents);

  if (gameObj && gameObj.war) { // Checking if gameID is valid and that war was declared.
    if (shotType === 'bomber') { // CHecking the type of show, and if it is a bomber show we use this logic.
      if (gameObj.continents[launchID].distances[targetID] <= 1 && gameObj.continents[launchID].forces.bombers.total > 0) { // Making sure target is within correct distance and that the player has bombers available.
        let updateBomberObj = {
          total: gameObj.continents[launchID].forces.bombers.total - 1
        }; // Get ready to write an update to the game object decrementing the number of bombers available from launch zone.
        let updateHpObj = {
          hp: gameObj.continents[targetID].hp - (50 + Math.floor(gameObj.players[player].rnd.damage / 500) * 5)
        }; // Get ready to write an update to the game object decrementing the HP from the target continent.
        let shotsFired = gameObj.players[player].shotsFired + 1; // Get ready to write an update to the game object increasing number of shots fired.
        // These next three lines are writing those Firebase updates.
        await gameRef.child(`players/${player}`).update({
          shotsFired: shotsFired
        });
        await gameRef.child(`continents/${targetID}`).update(updateHpObj);
        await gameRef.child(`continents/${launchID}/forces/bombers`).update(updateBomberObj);
        // Then we send a 200 status indicating all is done.
        ctx.status = 200;

        // Changing the HP for this continent and remaining bombers for launch continent in the local copy of the gameObj. (To make later checks easier/cleaner.)
        gameObj.continents[targetID].hp = gameObj.continents[targetID].hp - (50 + Math.floor(gameObj.players[player].rnd.damage / 500) * 5);
        gameObj.continents[continent].forces.bombers.total = gameObj.continents[continent].forces.bombers.total - 1;

        // Running the check to see if this is game over due to all HP being lost or because of rubble loss...
        enemyPlayerArr.forEach((enemy) => {
          // Check the enemy's continents to see if any have any HP left.
          let enemyContinents = Object.keys(gameObj.players[enemy].continents);
          enemyContinents.forEach((enemyContinent) => {
            if (gameObj.continents[enemyContinent].hp > 0) {
              gameOver = false;
              if (gameObj.continents[enemyContinent].forces.bombers.total > 0 || gameObj.continents[enemyContinent].forces.icbms.total > 0) {
                rubbleLoss = false;
              }
            }
          });
          // Check the enemy subs to see if there are any left.
          let enemyOceans = Object.keys(gameObj.players[enemy].oceans);
          enemyOceans.forEach((enemyOcean) => {
            if (gameObj.oceans[enemyOcean].subs[enemy].total > 0) {
              gameOver = false;
              rubbleLoss = false;
            }
          });
        }); // End of forEach through every enemy checking if the game is over.

        // Now we check the player information for a possible rubble loss.
        playerContinents.forEach((continent) => { // Going through all of player's continents.
          if (gameObj.continents[continent].hp > 0 && (gameObj.continents[continent].forces.bombers.total > 0 || gameObj.continents[continent].forces.icbms.total > 0)) { // If any have any HP & forces left, it's not a rubble loss.
            rubbleLoss = false;
          }
        }); // End of checking player's continents for possible rubble loss.

        let playerOceans = Object.keys(gameObj.players[player].oceans);
        playerOceans.forEach((playerOcean) => { // Going through all of player's oceans.
          if (gameObj.oceans[playerOcean].subs[player].total > 0) { // If there are any subs left, it's not a rubble loss.
            rubbleLoss = false;
          }
        }); // End of checking player's oceans for a possible rubble loss.

      } else { // If target is too far for bomber to reach or if continent has no bombers available.
        ctx.status = 400;
        ctx.body = {
          message: 'Target out of reach for bombers, or no bombers available.',
        };
      } // End of onditional checking if there are bombers available and if target is in range
    } else if (shotType === 'icbm') { // If the type of shot is ICBM.
      if (gameObj.continents[launchID].forces.icbms.total > 0) {
        let updateIcbmObj = {
          total: gameObj.continents[launchID].forces.icbms.total - 1
        };
        let updateHpObj = {
          hp: gameObj.continents[targetID].hp - (50 + Math.floor(gameObj.players[player].rnd.damage / 500) * 5)
        };
        let shotsFired = gameObj.players[player].shotsFired + 1;
        await gameRef.child(`players/${player}`).update({
          shotsFired: shotsFired
        });
        await gameRef.child(`continents/${targetID}`).update(updateHpObj);
        await gameRef.child(`continents/${launchID}/forces/icbms`).update(updateIcbmObj);
        ctx.status = 200;

        // Changing the HP for this continent and the number of total ICBMs in the launching continent in the local copy of the gameObj.
        gameObj.continents[targetID].hp = gameObj.continents[targetID].hp - (50 + Math.floor(gameObj.players[player].rnd.damage / 500) * 5);
        gameObj.continents[launchID].forces.icbms.total -= 1;

        // Running the check to see if this is game over...
        enemyPlayerArr.forEach((enemy) => {
          // Check the enemy's continents to see if any have any HP left.
          let enemyContinents = Object.keys(gameObj.players[enemy].continents);
          enemyContinents.forEach((enemyContinent) => {
            if (gameObj.continents[enemyContinent].hp > 0) {
              gameOver = false;
              if (gameObj.continents[enemyContinent].forces.bombers.total > 0 || gameObj.continents[enemyContinent].forces.icbms.total > 0) {
                rubbleLoss = false;
              }
            }
          });
          // Check the enemy subs to see if there are any left.
          let enemyOceans = Object.keys(gameObj.players[enemy].oceans);
          enemyOceans.forEach((enemyOcean) => {
            if (gameObj.oceans[enemyOcean].subs[enemy].total > 0) {
              gameOver = false;
              rubbleLoss = false;
            }
          });
        }); // End of forEach through every enemy checking if the game is over.

        playerContinents.forEach((continent) => {
          if (gameObj.continents[continent].hp > 0 && (gameObj.continents[continent].forces.bombers.total > 0 || gameObj.continents[continent].forces.icbms.total > 0)) {
            rubbleLoss = false;
          }
        }); // End of checking player's continents for possible rubble loss.

        let playerOceans = Object.keys(gameObj.players[player].oceans);
        playerOceans.forEach((playerOcean) => {
          if (gameObj.oceans[playerOcean].subs[player].total > 0) {
            rubbleLoss = false;
          }
        }); // End of checking player's oceans for a possible rubble loss.

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
  if (gameOver && gameObj.war) {
    await gameRef.once('value', (snap) => {
      gameObj = snap.val();
    }); // end of grabbing the info from Firebase one more time in case there were cross-fire shots that caused everyone to lose.
    let warWon = false;
    let remainingHP = 0;

    playerContinents.forEach((continent) => {
      if (gameObj.continents[continent].hp > 0) {
        warWon = true;
        remainingHP += gameObj.continents[continent].hp;
      }
    }); // end of the forEach checking player's continents for HP.
    if (warWon) { // Checking if player actually won the war.
      gameRef.update({
        gameOver: {
          type: 'warWon',
          winner: player
        }
      });
      let enemyTableInfo = await knex.select('*').from('users').whereIn('username', enemyPlayerArr);
      let playerTableInfo = await knex.select('*').from('users').whereIn('username', player);
      let gameIDforDB = await knex('games').returning('id').insert({
        outcome: 'warWon'
      });

      // Here is where we map the enemy player info to write to player DB.
      let enemiesDatabaseWrite = enemyTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
        return {
          user_id: entry.id,
          game_id: gameIDforDB[0],
          won: false,
          hit_points: 0,
          score: 0,
          shots: gameObj.players[(entry.username)].shotsFired,
          rnd_multiplier: rndMultiplier
        };
      });
      // And here is where we write the enemy player info to DB.
      await knex('players').insert(enemiesDatabaseWrite);

      let winnerHitPoints = 0;
      let playerDatabaseWrite = playerTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
        playerContinents.forEach((continent) => {
          winnerHitPoints += gameObj.continents[continent].hp;
        });
        return {
          user_id: entry.id,
          game_id: gameIDforDB[0],
          won: true,
          hit_points: winnerHitPoints,
          score: winnerHitPoints,
          shots: gameObj.players[(entry.username)].shotsFired,
          rnd_multiplier: rndMultiplier
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
          average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score) + winnerHitPoints) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };
        if (playerTableInfo[0].high_score < winnerHitPoints) {
          updatePlayerOne.high_score = winnerHitPoints;
        }
        let updatePlayerTwo = {
          average_score: (((enemyTableInfo[0].wins + enemyTableInfo[0].losses) * enemyTableInfo[0].average_score)) / (enemyTableInfo[0].wins + enemyTableInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);

      } else if (enemyPlayerArr.length + 1 === 3) { // If we have three players in the game, updating info for three players.

        let updatePlayerOne = {
          average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score) + winnerHitPoints) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };
        if (playerTableInfo[0].high_score < winnerHitPoints) {
          updatePlayerOne.high_score = winnerHitPoints;
        }

        let secondPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[0];
        });
        let updatePlayerTwo = {
          average_score: ((secondPlayerInfo[0].wins + secondPlayerInfo[0].losses) * secondPlayerInfo[0].average_score) / (secondPlayerInfo[0].wins + secondPlayerInfo[0].losses + 1)
        };
        let thirdPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[1];
        });
        let updatePlayerThree = {
          average_score: ((thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses) * thirdPlayerInfo[0].average_score) / (thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);
        await knex('users').where('username', enemyPlayerArr[1]).update(updatePlayerThree);
      } // End of conditional checking if there are 2 or 3 players in the game.

    } else { // If the game is over but everyone was destroyed.

      gameRef.update({
        gameOver: {
          type: 'destroyed',
          winner: 'none'
        }
      });
      let enemyTableInfo = await knex.select('*').from('users').whereIn('username', enemyPlayerArr);
      let playerTableInfo = await knex.select('*').from('users').whereIn('username', player);
      let gameIDforDB = await knex('games').returning('id').insert({
        outcome: 'destroyed'
      });

      // Here is where we map the enemy player info to write to player DB.
      let enemiesDatabaseWrite = enemyTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
        return {
          user_id: entry.id,
          game_id: gameIDforDB[0],
          won: false,
          hit_points: 0,
          score: 0,
          shots: gameObj.players[(entry.username)].shotsFired,
          rnd_multiplier: rndMultiplier
        };
      });
      // And here is where we write the enemy player info to DB.
      await knex('players').insert(enemiesDatabaseWrite);

      let playerDatabaseWrite = playerTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
        playerContinents.forEach((continent) => {
          winnerHitPoints += gameObj.continents[continent].hp;
        });
        return {
          user_id: entry.id,
          game_id: gameIDforDB[0],
          won: false,
          hit_points: 0,
          score: 0,
          shots: gameObj.players[(entry.username)].shotsFired,
          rnd_multiplier: rndMultiplier
        };
      });
      // And here is where we write the winning player info to DB.
      await knex('players').insert(playerDatabaseWrite);
      // Then we increase the enemy's losses by 1.
      await knex('users').whereIn('username', enemyPlayerArr).increment('losses', 1);
      // While increasing the player's losses by 1.
      await knex('users').where('username', player).increment('losses', 1);


      if (enemyPlayerArr.length + 1 === 2) { // If we have two players in the game, updating info for two players.
        // let firstPlayerInfo = userTableInfo.filter((entry) => {
        //   return entry.username === playersArr[0];
        // });
        let updatePlayerOne = {
          average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score)) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };
        let updatePlayerTwo = {
          average_score: (((enemyTableInfo[0].wins + enemyTableInfo[0].losses) * enemyTableInfo[0].average_score)) / (enemyTableInfo[0].wins + enemyTableInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);

      } else if (enemyPlayerArr.length + 1 === 3) { // If we have three players in the game, updating info for three players.

        let updatePlayerOne = {
          average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score)) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };

        let secondPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[0];
        });
        let updatePlayerTwo = {
          average_score: ((secondPlayerInfo[0].wins + secondPlayerInfo[0].losses) * secondPlayerInfo[0].average_score) / (secondPlayerInfo[0].wins + secondPlayerInfo[0].losses + 1)
        };
        let thirdPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[1];
        });
        let updatePlayerThree = {
          average_score: ((thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses) * thirdPlayerInfo[0].average_score) / (thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);
        await knex('users').where('username', enemyPlayerArr[1]).update(updatePlayerThree);
      } // End of conditional checking if there are 2 or 3 players in the game.
    } // end of conditional checking if game was won or if everyone lost.
  } // end of conditional checking if we are in a gameOver state.


  // If the game is over, we end game and start writing to database.
  if (rubbleLoss && gameObj.war) {
    gameRef.update({
      gameOver: {
        type: 'rubble',
        winner: 'none'
      }
    });
    let enemyTableInfo = await knex.select('*').from('users').whereIn('username', enemyPlayerArr);
    let playerTableInfo = await knex.select('*').from('users').whereIn('username', player);
    let gameIDforDB = await knex('games').returning('id').insert({
      outcome: 'rubble'
    });

    // Here is where we map the enemy player info to write to player DB.
    let enemiesDatabaseWrite = enemyTableInfo.map((entry) => {
      let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
      let thisEnemyContinents = Object.keys(gameObj.players[(entry.username)].continents);
      let enemyHP = 0;
      thisEnemyContinents.forEach((thisEnemyContinent) => {
        enemyHP += gameObj.continents[thisEnemyContinent].hp;
      });
      return {
        user_id: entry.id,
        game_id: gameIDforDB[0],
        won: false,
        hit_points: enemyHP,
        score: 0,
        shots: gameObj.players[(entry.username)].shotsFired,
        rnd_multiplier: rndMultiplier
      };
    });
    // And here is where we write the enemy player info to DB.
    await knex('players').insert(enemiesDatabaseWrite);

    let playerDatabaseWrite = playerTableInfo.map((entry) => {
      let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
      let playerHitPoints = 0;
      playerContinents.forEach((continent) => {
        playerHitPoints += gameObj.continents[continent].hp;
      });
      return {
        user_id: entry.id,
        game_id: gameIDforDB[0],
        won: false,
        hit_points: playerHitPoints,
        score: 0,
        shots: gameObj.players[(entry.username)].shotsFired,
        rnd_multiplier: rndMultiplier
      };
    });
    // And here is where we write the winning player info to DB.
    await knex('players').insert(playerDatabaseWrite);
    // Then we increase the enemy's losses by 1.
    await knex('users').whereIn('username', enemyPlayerArr).increment('losses', 1);
    // While increasing the player's losses by 1.
    await knex('users').where('username', player).increment('losses', 1);


    if (enemyPlayerArr.length + 1 === 2) { // If we have two players in the game, updating info for two players.
      // let firstPlayerInfo = userTableInfo.filter((entry) => {
      //   return entry.username === playersArr[0];
      // });
      let updatePlayerOne = {
        average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score)) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
      };
      let updatePlayerTwo = {
        average_score: (((enemyTableInfo[0].wins + enemyTableInfo[0].losses) * enemyTableInfo[0].average_score)) / (enemyTableInfo[0].wins + enemyTableInfo[0].losses + 1)
      };
      await knex('users').where('username', player).update(updatePlayerOne);
      await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);

    } else if (enemyPlayerArr.length + 1 === 3) { // If we have three players in the game, updating info for three players.

      let updatePlayerOne = {
        average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score)) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
      };

      let secondPlayerInfo = enemyTableInfo.filter((entry) => {
        return entry.username === enemyPlayerArr[0];
      });
      let updatePlayerTwo = {
        average_score: ((secondPlayerInfo[0].wins + secondPlayerInfo[0].losses) * secondPlayerInfo[0].average_score) / (secondPlayerInfo[0].wins + secondPlayerInfo[0].losses + 1)
      };
      let thirdPlayerInfo = enemyTableInfo.filter((entry) => {
        return entry.username === enemyPlayerArr[1];
      });
      let updatePlayerThree = {
        average_score: ((thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses) * thirdPlayerInfo[0].average_score) / (thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses + 1)
      };
      await knex('users').where('username', player).update(updatePlayerOne);
      await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);
      await knex('users').where('username', enemyPlayerArr[1]).update(updatePlayerThree);
    } // End of conditional checking if there are 2 or 3 players in the game.
  } // end of conditional checking if we are in a rubbleLoss


}); // end of the "shot" route.


// This is the route for a submarine shot.
router.put('/subshot', async (ctx) => {
  let gameID = ctx.request.body.gameID; // The ID for this game instance.
  let gameRef = ref.child(gameID); // Referencing this game in the database.
  let targetID = ctx.request.body.targetID; // The target continent.
  let launchID = ctx.request.body.launchID; // The launching ocean.
  let shooterID = ctx.request.body.shooterID; // The player making the shot.
  let gameObj; // The variable that will hold gameobject data, put here to scope outside of the data grab.
  let gameOver = true; // Boolean checking if game is over.
  let rubbleLoss = true; // Boolean checking if game was a rubble loss.

  await gameRef.once('value', (snap) => {
    gameObj = snap.val();
  }); // end of grabbing the info from Firebase.

  // An array of all the players.
  let playerArr = Object.keys(gameObj.players);
  let player = shooterID;
  // An array of all the enemy players. (Everybody except this player.)
  let enemyPlayerArr = playerArr.slice(0);
  enemyPlayerArr.splice(enemyPlayerArr.indexOf(player), 1);

  // An array of the player's continents.
  let playerContinents = Object.keys(gameObj.players[player].continents);

  if (gameObj && gameObj.war) { // Checking if gameID is valid.
    if (gameObj.continents[targetID].oceans[launchID] && gameObj.oceans[launchID].subs[shooterID].total > 0) {
      let subsTotal = gameObj.oceans[launchID].subs[shooterID].total - 1;
      let updateHpObj = {
        hp: gameObj.continents[targetID].hp - (50 + Math.floor(gameObj.players[shooterID].rnd.damage / 500) * 5)
      };
      let shotsFired = gameObj.players[shooterID].shotsFired + 1;
      gameRef.child(`players/${shooterID}`).update({
        shotsFired: shotsFired
      });
      gameRef.child(`continents/${targetID}`).update(updateHpObj);
      gameRef.child(`oceans/${launchID}/subs/${shooterID}`).update({
        total: subsTotal
      });
      ctx.status = 200;

      // Changing the HP for this continent and subtracting the total number of subs for the shootign player in the launching ocean in the local copy of the gameObj.
      gameObj.continents[targetID].hp = gameObj.continents[targetID].hp - (50 + Math.floor(gameObj.players[player].rnd.damage / 500) * 5);
      gameObj.oceans[launchID].subs[shooterID].total -= 1;

      // Check to see if game is over/everything is destroyed.
      // Running the check to see if this is game over...
      enemyPlayerArr.forEach((enemy) => {
        // Check the enemy's continents to see if any have any HP left.
        let enemyContinents = Object.keys(gameObj.players[enemy].continents);
        enemyContinents.forEach((enemyContinent) => {
          if (gameObj.continents[enemyContinent].hp > 0) {
            gameOver = false;
            if (gameObj.continents[enemyContinent].forces.bombers.total > 0 || gameObj.continents[enemyContinent].forces.icbms.total > 0) {
              rubbleLoss = false;
            }
          }
        });
        // Check the enemy subs to see if there are any left.
        let enemyOceans = Object.keys(gameObj.players[enemy].oceans);
        enemyOceans.forEach((enemyOcean) => {
          if (gameObj.oceans[enemyOcean].subs[enemy].total > 0) {
            gameOver = false;
            rubbleLoss = false;
          }
        });
      }); // End of forEach through every enemy checking if the game is over.

      playerContinents.forEach((continent) => {
        if (gameObj.continents[continent].hp > 0 && (gameObj.continents[continent].forces.bombers.total > 0 || gameObj.continents[continent].forces.icbms.total > 0)) {
          rubbleLoss = false;
        }
      }); // End of checking player's continents for possible rubble loss.

      let playerOceans = Object.keys(gameObj.players[player].oceans);
      playerOceans.forEach((playerOcean) => {
        if (gameObj.oceans[playerOcean].subs[player].total > 0) {
          rubbleLoss = false;
        }
      }); // End of checking player's oceans for a possible rubble loss.


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


  // If the game is over, we end game and start writing to database.
  if (gameOver && gameObj.war) {
    await gameRef.once('value', (snap) => {
      gameObj = snap.val();
    }); // end of grabbing the info from Firebase one more time in case there were cross-fire shots that caused everyone to lose.
    let warWon = false;
    let remainingHP = 0;
    playerContinents.forEach((continent) => {
      if (gameObj.continents[continent].hp > 0) {
        warWon = true;
        remainingHP += gameObj.continents[continent].hp;
      }
    }); // end of the forEach checking player's continents for HP.
    if (warWon) { // Checking if player actually won the war.
      gameRef.update({
        gameOver: {
          type: 'warWon',
          winner: player
        }
      });
      let enemyTableInfo = await knex.select('*').from('users').whereIn('username', enemyPlayerArr);
      let playerTableInfo = await knex.select('*').from('users').whereIn('username', player);
      let gameIDforDB = await knex('games').returning('id').insert({
        outcome: 'warWon'
      });

      // Here is where we map the enemy player info to write to player DB.
      let enemiesDatabaseWrite = enemyTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
        return {
          user_id: entry.id,
          game_id: gameIDforDB[0],
          won: false,
          hit_points: 0,
          score: 0,
          shots: gameObj.players[(entry.username)].shotsFired,
          rnd_multiplier: rndMultiplier
        };
      });
      // And here is where we write the enemy player info to DB.
      await knex('players').insert(enemiesDatabaseWrite);

      let winnerHitPoints = 0;
      let playerDatabaseWrite = playerTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
        playerContinents.forEach((continent) => {
          winnerHitPoints += gameObj.continents[continent].hp;
        });
        return {
          user_id: entry.id,
          game_id: gameIDforDB[0],
          won: true,
          hit_points: winnerHitPoints,
          score: winnerHitPoints,
          shots: gameObj.players[(entry.username)].shotsFired,
          rnd_multiplier: rndMultiplier
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
          average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score) + winnerHitPoints) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };
        if (playerTableInfo[0].high_score < winnerHitPoints) {
          updatePlayerOne.high_score = winnerHitPoints;
        }
        let updatePlayerTwo = {
          average_score: (((enemyTableInfo[0].wins + enemyTableInfo[0].losses) * enemyTableInfo[0].average_score)) / (enemyTableInfo[0].wins + enemyTableInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);

      } else if (enemyPlayerArr.length + 1 === 3) { // If we have three players in the game, updating info for three players.

        let updatePlayerOne = {
          average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score) + winnerHitPoints) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };
        if (playerTableInfo[0].high_score < winnerHitPoints) {
          updatePlayerOne.high_score = winnerHitPoints;
        }

        let secondPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[0];
        });
        let updatePlayerTwo = {
          average_score: ((secondPlayerInfo[0].wins + secondPlayerInfo[0].losses) * secondPlayerInfo[0].average_score) / (secondPlayerInfo[0].wins + secondPlayerInfo[0].losses + 1)
        };
        let thirdPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[1];
        });
        let updatePlayerThree = {
          average_score: ((thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses) * thirdPlayerInfo[0].average_score) / (thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);
        await knex('users').where('username', enemyPlayerArr[1]).update(updatePlayerThree);
      } // End of conditional checking if there are 2 or 3 players in the game.

    } else { // If the game is over but everyone was destroyed.

      gameRef.update({
        gameOver: {
          type: 'destroyed',
          winner: 'none'
        }
      });
      let enemyTableInfo = await knex.select('*').from('users').whereIn('username', enemyPlayerArr);
      let playerTableInfo = await knex.select('*').from('users').whereIn('username', player);
      let gameIDforDB = await knex('games').returning('id').insert({
        outcome: 'destroyed'
      });

      // Here is where we map the enemy player info to write to player DB.
      let enemiesDatabaseWrite = enemyTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
        return {
          user_id: entry.id,
          game_id: gameIDforDB[0],
          won: false,
          hit_points: 0,
          score: 0,
          shots: gameObj.players[(entry.username)].shotsFired,
          rnd_multiplier: rndMultiplier
        };
      });
      // And here is where we write the enemy player info to DB.
      await knex('players').insert(enemiesDatabaseWrite);

      let playerDatabaseWrite = playerTableInfo.map((entry) => {
        let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
        playerContinents.forEach((continent) => {
          winnerHitPoints += gameObj.continents[continent].hp;
        });
        return {
          user_id: entry.id,
          game_id: gameIDforDB[0],
          won: false,
          hit_points: 0,
          score: 0,
          shots: gameObj.players[(entry.username)].shotsFired,
          rnd_multiplier: rndMultiplier
        };
      });
      // And here is where we write the winning player info to DB.
      await knex('players').insert(playerDatabaseWrite);
      // Then we increase the enemy's losses by 1.
      await knex('users').whereIn('username', enemyPlayerArr).increment('losses', 1);
      // While increasing the player's losses by 1.
      await knex('users').where('username', player).increment('losses', 1);


      if (enemyPlayerArr.length + 1 === 2) { // If we have two players in the game, updating info for two players.
        // let firstPlayerInfo = userTableInfo.filter((entry) => {
        //   return entry.username === playersArr[0];
        // });
        let updatePlayerOne = {
          average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score)) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };
        let updatePlayerTwo = {
          average_score: (((enemyTableInfo[0].wins + enemyTableInfo[0].losses) * enemyTableInfo[0].average_score)) / (enemyTableInfo[0].wins + enemyTableInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);

      } else if (enemyPlayerArr.length + 1 === 3) { // If we have three players in the game, updating info for three players.

        let updatePlayerOne = {
          average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score)) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
        };

        let secondPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[0];
        });
        let updatePlayerTwo = {
          average_score: ((secondPlayerInfo[0].wins + secondPlayerInfo[0].losses) * secondPlayerInfo[0].average_score) / (secondPlayerInfo[0].wins + secondPlayerInfo[0].losses + 1)
        };
        let thirdPlayerInfo = enemyTableInfo.filter((entry) => {
          return entry.username === enemyPlayerArr[1];
        });
        let updatePlayerThree = {
          average_score: ((thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses) * thirdPlayerInfo[0].average_score) / (thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses + 1)
        };
        await knex('users').where('username', player).update(updatePlayerOne);
        await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);
        await knex('users').where('username', enemyPlayerArr[1]).update(updatePlayerThree);
      } // End of conditional checking if there are 2 or 3 players in the game.
    } // end of conditional checking if game was won or if everyone lost.
  } // end of conditional checking if we are in a gameOver state.


  // If the game is over, we end game and start writing to database.
  if (rubbleLoss && gameObj.war) {
    gameRef.update({
      gameOver: {
        type: 'rubble',
        winner: 'none'
      }
    });
    let enemyTableInfo = await knex.select('*').from('users').whereIn('username', enemyPlayerArr);
    let playerTableInfo = await knex.select('*').from('users').whereIn('username', player);
    let gameIDforDB = await knex('games').returning('id').insert({
      outcome: 'rubble'
    });

    // Here is where we map the enemy player info to write to player DB.
    let enemiesDatabaseWrite = enemyTableInfo.map((entry) => {
      let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
      let thisEnemyContinents = Object.keys(gameObj.players[(entry.username)].continents);
      let enemyHP = 0;
      thisEnemyContinents.forEach((thisEnemyContinent) => {
        enemyHP += gameObj.continents[thisEnemyContinent].hp;
      });
      return {
        user_id: entry.id,
        game_id: gameIDforDB[0],
        won: false,
        hit_points: enemyHP,
        score: 0,
        shots: gameObj.players[(entry.username)].shotsFired,
        rnd_multiplier: rndMultiplier
      };
    });
    // And here is where we write the enemy player info to DB.
    await knex('players').insert(enemiesDatabaseWrite);

    let playerDatabaseWrite = playerTableInfo.map((entry) => {
      let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage / 500);
      let playerHitPoints = 0;
      playerContinents.forEach((continent) => {
        playerHitPoints += gameObj.continents[continent].hp;
      });
      return {
        user_id: entry.id,
        game_id: gameIDforDB[0],
        won: false,
        hit_points: playerHitPoints,
        score: 0,
        shots: gameObj.players[(entry.username)].shotsFired,
        rnd_multiplier: rndMultiplier
      };
    });
    // And here is where we write the winning player info to DB.
    await knex('players').insert(playerDatabaseWrite);
    // Then we increase the enemy's losses by 1.
    await knex('users').whereIn('username', enemyPlayerArr).increment('losses', 1);
    // While increasing the player's losses by 1.
    await knex('users').where('username', player).increment('losses', 1);


    if (enemyPlayerArr.length + 1 === 2) { // If we have two players in the game, updating info for two players.
      // let firstPlayerInfo = userTableInfo.filter((entry) => {
      //   return entry.username === playersArr[0];
      // });
      let updatePlayerOne = {
        average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score)) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
      };
      let updatePlayerTwo = {
        average_score: (((enemyTableInfo[0].wins + enemyTableInfo[0].losses) * enemyTableInfo[0].average_score)) / (enemyTableInfo[0].wins + enemyTableInfo[0].losses + 1)
      };
      await knex('users').where('username', player).update(updatePlayerOne);
      await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);

    } else if (enemyPlayerArr.length + 1 === 3) { // If we have three players in the game, updating info for three players.

      let updatePlayerOne = {
        average_score: (((playerTableInfo[0].wins + playerTableInfo[0].losses) * playerTableInfo[0].average_score)) / (playerTableInfo[0].wins + playerTableInfo[0].losses + 1)
      };

      let secondPlayerInfo = enemyTableInfo.filter((entry) => {
        return entry.username === enemyPlayerArr[0];
      });
      let updatePlayerTwo = {
        average_score: ((secondPlayerInfo[0].wins + secondPlayerInfo[0].losses) * secondPlayerInfo[0].average_score) / (secondPlayerInfo[0].wins + secondPlayerInfo[0].losses + 1)
      };
      let thirdPlayerInfo = enemyTableInfo.filter((entry) => {
        return entry.username === enemyPlayerArr[1];
      });
      let updatePlayerThree = {
        average_score: ((thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses) * thirdPlayerInfo[0].average_score) / (thirdPlayerInfo[0].wins + thirdPlayerInfo[0].losses + 1)
      };
      await knex('users').where('username', player).update(updatePlayerOne);
      await knex('users').where('username', enemyPlayerArr[0]).update(updatePlayerTwo);
      await knex('users').where('username', enemyPlayerArr[1]).update(updatePlayerThree);
    } // End of conditional checking if there are 2 or 3 players in the game.
  } // end of conditional checking if we are in a rubbleLoss

}); // end of "subshot" route


module.exports = router;
