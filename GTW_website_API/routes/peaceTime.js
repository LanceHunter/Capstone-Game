'use strict';

// Firebase setup.
const admin = require('firebase-admin');
const firebase = admin.database();
const ref = firebase.ref('gameInstance');

// Getting Knex
const config = require('../knexfile')[process.env.ENV || 'development'];
const knex = require('knex')(config);


//Setting up koa routing
const router = require('koa-router')();

router.prefix('/api/peacetime');

// Setting up variables for deploy and maintinence costs, so we can chance them in a single place instead of everywhere.
const subMaint = 20;
const icbmMaint = 20;
const bomberMaint = 10;
const subCost = 200;
const icbmCost = 100;
const bomberCost = 50;

router.post('/yearcomplete', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let allComplete = true; // Boolean for if everyone marked the year as complete.
  let gameOver = false; // Boolean for if we've reached a win condition.
  let gameObj;

  await gameRef.once('value', (snap) => {
    gameObj = snap.val();
  }); // end of grab of firebase data for game.

  // Getting an array of the players.
  let playersArr = Object.keys(gameObj.players);

  if (gameObj && !(gameObj.players[playerID].yearComplete)) { // Verifying that game ID is valid and that player hasn't double-ended year.
    gameRef.child(`players/${playerID}`).update({
      spyMessage : '',
      yearComplete: true
    });

    playersArr.forEach((player) => {
      if (player !== playerID && !gameObj.players[player].yearComplete) {
        allComplete = false;
      }
    });

    if (allComplete) {
      console.log(`They're all complete, time for next year!`);
      let newYear = gameObj.year + 1;
      console.log('The new year is - ', newYear);
      gameRef.update({year : newYear}); // Updating the year.
      playersArr.forEach((player) => {
        let nextYearBudget = 0;
        let myContinentsArr = Object.keys(gameObj.players[player].continents);
        myContinentsArr.forEach((continent) => {
          nextYearBudget += gameObj.continents[continent].budget;
          nextYearBudget -= gameObj.continents[continent].forces.bombers.total * bomberMaint;
          nextYearBudget -= gameObj.continents[continent].forces.icbms.total * icbmMaint;
        }); // End of checking each continent.
        let myOceansArr = Object.keys(gameObj.players[player].oceans);
        myOceansArr.forEach((ocean) => {
          nextYearBudget -= gameObj.oceans[ocean].subs[player].total * subMaint;
        }); // End of checking each ocean.
        gameRef.child(`players/${player}`).update({currentBudget : nextYearBudget});
        gameRef.child(`players/${player}`).update({yearComplete : false});
      }); // End of setting the new budget for each player.

      /// Here is where we see if there are no weapons on earth at all.
      let yearsWithNoWeapons = gameObj.yearsWithNoWeapons + 1;
      let allContinentsArr = Object.keys(gameObj.continents);
      let allOceansArr = Object.keys(gameObj.oceans);

      allContinentsArr.forEach((continent) => {
        if (gameObj.continents[continent].forces.bombers.total > 0) {
          yearsWithNoWeapons = 0;
          if (Math.random() > 0.8 && gameObj.continents[continent].forces.bombers.total !== gameObj.continents[continent].forces.bombers.declared) {
            let spyPlayersArr = playersArr.splice(playersArr.indexOf(gameObj.continents[continent].player), 1);
            let recipientPlayer = spyPlayersArr[Math.floor(Math.random()*spyPlayersArr.length)];
            let spyMessage = gameObj.players[recipientPlayer].spyMessage + `Your spies discovered that ${gameObj.continents[continent].player} has ${gameObj.continents[continent].forces.bombers.total - gameObj.continents[continent].forces.bombers.declared} undeclared bombers in ${continent.name}! `;
            gameRef.child(`players/${recipientPlayer}`).update({spyMessage:spyMessage});
          } // End of spy message.
        } // End of checking for bombers.

        if (gameObj.continents[continent].forces.icbms.total > 0) {
          yearsWithNoWeapons = 0;
          if (Math.random() > 0.7 && gameObj.continents[continent].forces.icbms.total !== gameObj.continents[continent].forces.icbms.declared) {
            let spyPlayersArr = playersArr.slice(0);
            spyPlayersArr.splice(playersArr.indexOf(gameObj.continents[continent].player), 1);
            let recipientPlayer = spyPlayersArr[Math.floor(Math.random()*spyPlayersArr.length)];
            let spyMessage = gameObj.players[recipientPlayer].spyMessage + `Your spies discovered that ${gameObj.continents[continent].player} has ${gameObj.continents[continent].forces.icbms.total - gameObj.continents[continent].forces.icbms.declared} undeclared ICBMs in ${continent.name}! `;
            gameRef.child(`players/${recipientPlayer}`).update({spyMessage:spyMessage});
          } // End of spy message roll.
        } // End of checking for ICBMs.
      }); // End of checking all continents for weapons.

      allOceansArr.forEach((ocean) => {
        let playerSubsArr = Object.keys(gameObj.oceans[ocean].subs);
        playerSubsArr.forEach((playerInOcean) => {
          if (gameObj.oceans[ocean].subs[playerInOcean].total > 0) {
            yearsWithNoWeapons = 0;
            if (Math.random() > 0.9 && gameObj.oceans[ocean].subs[playerInOcean].total !== gameObj.oceans[ocean].subs[playerInOcean].declared) {
              let spyPlayersArr = playersArr.slice(0);
              spyPlayersArr.splice(playersArr.indexOf(playerInOcean), 1);
              let recipientPlayer = spyPlayersArr[Math.floor(Math.random()*spyPlayersArr.length)];
              let spyMessage = gameObj.players[recipientPlayer].spyMessage + `Your spies discovered that ${playerInOcean} has ${gameObj.oceans[ocean].subs[playerInOcean].total - gameObj.oceans[ocean].subs[playerInOcean].declared} undeclared submarines in the ${ocean.name}! `;
              gameRef.child(`players/${recipientPlayer}`).update({spyMessage:spyMessage});
            } // End of conditional checking spy roll fail.
          } // End of conditional checking if there are subs in the ocean for that player.
        }); // End of going through all the players in the ocean.
      }); // End of checking all oceans for weapons.
      gameRef.update({yearsWithNoWeapons : yearsWithNoWeapons}); // Finally, updating yearsWithNoWeapons in Firebase.
      if (yearsWithNoWeapons >= 3) {
        // If there are no weapons for 3 years, we have world peace and need to handle some knex writes in a seperate function down there.
        gameOver = true;
      } else {
        // Otherwise, set the status to 200, all is good.
        ctx.status = 200;
      }
    } else { // If not all players have marked the year as complete.
      ctx.status = 200;
    } // End of conditional checking to see if all players have marked the year as complete.
  } else { // If game ID isn't valid or player already ended this year.
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid game ID entered or year already ended for this player.',
    };
  } // end of coditional checking if game ID is valid.

  // If we end up in a situation where the game is over because of a "peace" win (no weapons on earth for 3 years).
  if (gameOver) { // TEMP set to true to test knex
    let continentArr = Object.keys(gameObj.continents);
    gameRef.update({gameOver : {type: 'worldPeace', winner: 'all'}});
    let userIDs = await knex.select('id', 'username').from('users').whereIn('username', playersArr);
    let gameIDforDB = await knex('games').returning('id').insert({outcome : 'peace'});
    let playersDatabaseWrite = userIDs.map((entry) => {
      let rndMultiplier = Math.floor(gameObj.players[(entry.username)].rnd.damage/500);
      let hitPoints = 0;
      continentArr.forEach((continent) => {
        if (gameObj.continents[continent].player[(entry.username)]) {
          hitPoints += gameObj.continents[continent].hp;
        }
      });
      return {
        user_id : entry.id,
        game_id : gameIDforDB[0],
        won : true,
        hit_points : hitPoints,
        score : 5000,
        shots : 0,
        rnd_multiplier : rndMultiplier
      };
    });
    await knex('players').insert(playersDatabaseWrite);
    console.log('Here is the gameIDforDB - ', gameIDforDB);
    console.log('Here is the playersDatabaseWrite', playersDatabaseWrite);
    ctx.status = 200;
  }

}); // end of "yearcomplete" route


router.put('/deploybomber', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let quantity = ctx.request.body.quantity;
  let location = ctx.request.body.location;

  await gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].currentBudget >= bomberCost * quantity && snap.val().players[playerID].continents[location]) {
        let bombers = snap.val().continents[location].forces.bombers.total + quantity;
        let currentBudget = snap.val().players[playerID].currentBudget - (bomberCost * quantity);
        gameRef.child(`players/${playerID}`).update({currentBudget : currentBudget});
        gameRef.child(`continents/${location}/forces/bombers`).update({total : bombers});
        ctx.status = 200;
      } else { // If the player doesn't have enough funds or is trying to put them on a continent they don't own.
        ctx.status = 400;
        ctx.body = {
          message: 'Insufficient funds to deploy or invalid location.',
        };
      } // End of budget/location conditional.
    } else { // If gameID isn't found.
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid game ID entered or was were declared.',
    };
    } // end of coditional checking if game ID is valid.
  }); // end of single-grab of firebase data.
}); // end of "deploybomber" route

router.put('/deployicbm', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let quantity = ctx.request.body.quantity;
  let location = ctx.request.body.location;

  await gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].currentBudget >= icbmCost * quantity && snap.val().players[playerID].continents[location]) {
        let icbms = snap.val().continents[location].forces.icbms.total + quantity;
        let currentBudget = snap.val().players[playerID].currentBudget - (icbmCost * quantity);
        gameRef.child(`players/${playerID}`).update({currentBudget : currentBudget});
        gameRef.child(`continents/${location}/forces/icbms`).update({total : icbms});
        ctx.status = 200;
      } else { // If the player doesn't have enough funds or is trying to put them on a continent they don't own.
        ctx.status = 400;
        ctx.body = {
          message: 'Insufficient funds to deploy or invalid location.',
        };
      } // End of budget/location conditional.
    } else { // If gameID isn't found.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID entered or war were declared.',
      };
    } // end of coditional checking if game ID is valid.
  }); // end of single-grab of firebase data.
}); // end of "deployicbm" route


router.put('/deploysub', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let quantity = ctx.request.body.quantity;
  let location = ctx.request.body.location;

  await gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].currentBudget >= subCost * quantity && snap.val().players[playerID].oceans[location]) {
        let subs = snap.val().oceans[location].subs[playerID].total + quantity;
        let currentBudget = snap.val().players[playerID].currentBudget - (subCost * quantity);
        gameRef.child(`players/${playerID}`).update({currentBudget : currentBudget});
        gameRef.child(`oceans/${location}/subs/${playerID}`).update({total : subs});
        ctx.status = 200;
      } else { // If the player doesn't have enough funds or is trying to put them on a continent they don't own.
        ctx.status = 400;
        ctx.body = {
          message: 'Insufficient funds to deploy or invalid location.',
        };
      } // End of budget/location conditional.
    } else { // If gameID isn't found.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID entered or war were declared.',
      };
    } // end of coditional checking if game ID is valid.
  }); // end of single-grab of firebase data.
}); // end of "deploysub" route

router.put('/declarebomber', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let quantity = ctx.request.body.quantity;
  let location = ctx.request.body.location;

  await gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].continents[location] && snap.val().continents[location].forces.bombers.declared + quantity <= snap.val().continents[location].forces.bombers.total) {
        let declaredNum = snap.val().continents[location].forces.bombers.declared + quantity;
        gameRef.child(`continents/${location}/forces/bombers`).update({declared : declaredNum});
        let totalDeclared = snap.val().players[playerID].totalDeclaredForces + quantity;
        gameRef.child(`players/${playerID}`).update({totalDeclaredForces : totalDeclared});
        ctx.status = 200;
      } else { //If continent doesn't belong to player or they are trying to delcare more bombers than their current total.
        ctx.status = 400;
        ctx.body = {
          message: 'Invalid location or amount to delcare would have brought declared total higher than total amount of forces.',
        };
      } // End of conditional checking on location and declared vs. total.
    } else { // If war were delcared or game ID was invalid.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID entered or war were declared.',
      };
    } // End of conditional checking game ID and if war were declared.
  }); // end of single-grab of firebase data.
}); // End of the "declarebomber" route.

router.put('/declareicbm', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let quantity = ctx.request.body.quantity;
  let location = ctx.request.body.location;

  await gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].continents[location] && snap.val().continents[location].forces.icbms.declared + quantity <= snap.val().continents[location].forces.icbms.total) {
        let declaredNum = snap.val().continents[location].forces.icbms.declared + quantity;
        gameRef.child(`continents/${location}/forces/icbms`).update({declared : declaredNum});
        let totalDeclared = snap.val().players[playerID].totalDeclaredForces + quantity;
        gameRef.child(`players/${playerID}`).update({totalDeclaredForces : totalDeclared});
        ctx.status = 200;
      } else { //If continent doesn't belong to player or they are trying to delcare more bombers than their current total.
        ctx.status = 400;
        ctx.body = {
          message: 'Invalid location or amount to delcare would have brought declared total higher than total amount of forces.',
        };
      } // End of conditional checking on location and declared vs. total.
    } else { // If war were delcared or game ID was invalid.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID entered or war were declared.',
      };
    } // End of conditional checking game ID and if war were declared.
  }); // end of single-grab of firebase data.
}); // End of the "declareicbms" route.


router.put('/declaresub', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let quantity = ctx.request.body.quantity;
  let location = ctx.request.body.location;

  await gameRef.once('value', (snap) => {
    if (snap.val() && !snap.val().war) {
      if (snap.val().players[playerID].oceans[location] && snap.val().oceans[location].subs[playerID].declared + quantity <= snap.val().oceans[location].subs[playerID].total) {
        let declaredNum = snap.val().oceans[location].subs[playerID].declared + quantity;
        gameRef.child(`oceans/${location}/subs/${playerID}`).update({declared : declaredNum});
        let totalDeclared = snap.val().players[playerID].totalDeclaredForces + quantity;
        gameRef.child(`players/${playerID}`).update({totalDeclaredForces : totalDeclared});
        ctx.status = 200;
      } else { //If continent doesn't belong to player or they are trying to delcare more bombers than their current total.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid location or amount to delcare would have brought declared total higher than total amount of forces.',
      };
      } // End of conditional checking on location and declared vs. total.
    } else { // If war were delcared or game ID was invalid.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID entered or war were declared.',
      };
    } // End of conditional checking game ID and if war were declared.
  }); // end of single-grab of firebase data.
}); // End of the "declaresubs" route.

router.put('/disarmbomber', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let quantity = ctx.request.body.quantity;
  let location = ctx.request.body.location;

  await gameRef.once('value', (snap) => {
    if (snap.val() && snap.val().continents[location].forces.bombers.total >= quantity) {
      let forcesObj = {
        declared : snap.val().continents[location].forces.bombers.declared,
        total : snap.val().continents[location].forces.bombers.total
      };
      if (snap.val().continents[location].forces.bombers.declared > 0) {
        let declaredTotal = snap.val().continents[location].forces.bombers.declared - quantity;
        let declaredGrandTotal = snap.val().players[playerID].totalDeclaredForces - quantity;
        if (declaredTotal < 0) { // If removing the disarmed quantity makes the total number of declared forces to be less than 0...
          declaredTotal = 0;
          declaredGrandTotal = snap.val().players[playerID].totalDeclaredForces - snap.val().continents[location].forces.bombers.declared;
        } // End of conditional for disarming more than total declared.
        forcesObj.declared = declaredTotal;

        gameRef.child(`players/${playerID}`).update({totalDeclaredForces : declaredGrandTotal});
        ctx.status = 200;
      } // End of conditional checking of there are any declared forces.
      forcesObj.total -= quantity;
      gameRef.child(`continents/${location}/forces/bombers`).update(forcesObj);
    } else { // If gameID is invalid or quantity to disarm is greater than total forces.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID entered or attempting to disarm more bombers the total amount in that location.',
      };
    } // End of conditional for gameID/disarm total.
  }); // End of grabbing information from Firebase.
}); // end of "disarmbomber" route.


router.put('/disarmicbm', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let quantity = ctx.request.body.quantity;
  let location = ctx.request.body.location;

  await gameRef.once('value', (snap) => {
    if (snap.val() && snap.val().continents[location].forces.icbms.total >= quantity) {
      let forcesObj = {
        declared : snap.val().continents[location].forces.icbms.declared,
        total : snap.val().continents[location].forces.icbms.total
      };
      if (snap.val().continents[location].forces.icbms.declared > 0) {
        let declaredTotal = snap.val().continents[location].forces.icbms.declared - quantity;
        let declaredGrandTotal = snap.val().players[playerID].totalDeclaredForces - quantity;
        if (declaredTotal < 0) { // If removing the disarmed quantity makes the total number of declared forces to be less than 0...
          declaredTotal = 0;
          declaredGrandTotal = snap.val().players[playerID].totalDeclaredForces - snap.val().continents[location].forces.icbms.declared;
        } // End of conditional for disarming more than total declared.
        forcesObj.declared = declaredTotal;
        gameRef.child(`players/${playerID}`).update({totalDeclaredForces : declaredGrandTotal});
        ctx.status = 200;
      } // End of conditional checking of there are any declared forces.
      forcesObj.total -= quantity;
      gameRef.child(`continents/${location}/forces/icbms`).update(forcesObj);
    } else { // If gameID is invalid or quantity to disarm is greater than total forces.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID entered or attempting to disarm more ICBMs the total amount in that location.',
      };
    } // End of conditional for gameID/disarm total.
  }); // End of grabbing information from Firebase.
}); // end of "disarmicbm" route.


router.put('/disarmsub', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let quantity = ctx.request.body.quantity;
  let location = ctx.request.body.location;

  await gameRef.once('value', (snap) => {
    if (snap.val() && snap.val().oceans[location].subs[playerID].total >= quantity) {
      let forcesObj = {
        declared : snap.val().oceans[location].subs[playerID].declared,
        total : snap.val().oceans[location].subs[playerID].total
      };
      if (snap.val().oceans[location].subs[playerID].declared > 0) {
        let declaredTotal = snap.val().oceans[location].subs[playerID].declared - quantity;
        let declaredGrandTotal = snap.val().players[playerID].totalDeclaredForces - quantity;
        if (declaredTotal < 0) { // If removing the disarmed quantity makes the total number of declared forces to be less than 0...
          declaredTotal = 0;
          declaredGrandTotal = snap.val().players[playerID].totalDeclaredForces - snap.val().oceans[location].subs[playerID].declared;
        } // End of conditional for disarming more than total declared.
        forcesObj.declared = declaredTotal;
        gameRef.child(`players/${playerID}`).update({totalDeclaredForces : declaredGrandTotal});
        ctx.status = 200;
      } // End of conditional checking of there are any declared forces.
      forcesObj.total -= quantity;
      gameRef.child(`oceans/${location}/subs/${playerID}`).update(forcesObj);
    } else { // If gameID is invalid or quantity to disarm is greater than total forces.
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid game ID entered or attempting to disarm more submarines than the total amount in that location.',
      };
    } // End of conditional for gameID/disarm total.
  }); // End of grabbing information from Firebase.
}); // end of "disarmsub" route.

router.put('/spendrnd', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  let playerID = ctx.request.body.playerID;
  let quantity = ctx.request.body.quantity;
  let type = ctx.request.body.type;

  await gameRef.once('value', (snap) => {
    if (snap.val() && snap.val().players[playerID].currentBudget >= quantity) {
      let currentBudget = snap.val().players[playerID].currentBudget - quantity;
      if (type === 'speed') {
        let speedSpent = snap.val().players[playerID].rnd.speed + quantity;
        gameRef.child(`players/${playerID}/rnd`).update({speed:speedSpent});
        gameRef.child(`players/${playerID}`).update({currentBudget:currentBudget});
        ctx.status = 200;
      } else if (type === 'damage') {
        let damageSpent = snap.val().players[playerID].rnd.damage + quantity;
        gameRef.child(`players/${playerID}/rnd`).update({damage:damageSpent});
        gameRef.child(`players/${playerID}`).update({currentBudget:currentBudget});
        ctx.status = 200;
      } else { // If type of spending is neither "speed" or "damage"
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid type of R&D spending provided.',
      };
      } // end of the type of spending conditional
    } else { // If gameID is invalid or amount spent is more than current budget.
      ctx.status = 400;
      ctx.body = {
        message: 'Not a valid gameID or amount spent is greater than remaining budget.',
      };
    } // end of the total budget and vali game ID conditional
  }); // end of the grab of data from firebase
}); // end of the "spendrnd" route


router.post('/declarewar', async (ctx) => {
  let gameID = ctx.request.body.gameID;
  let gameRef = ref.child(gameID);
  console.log('War!');
  await gameRef.once('value', (snap) => {
    if (snap.val()) { // Making sure gameID is in the system.
      gameRef.update({war:true});
      ctx.status = 200;
    } else { // If gameID isn't valid.
      ctx.status = 400;
      ctx.body = {
        message: 'Not a valid gameID.',
      };
    } // End of conditional checking to make sure gameID is valid.
  }); // End of grabbing data from Firebase.
}); // End of the "declarwar" route.



module.exports = router;
