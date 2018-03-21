/*
  fake peacetime
*/

function testGame(gameID) {
  let addPlayer = (playerID) => {
    return {
      url: '/api/pregame/joingame',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        'gameID': gameID,
        'playerID': playerID
      }),
    }
  };

  return $.ajax(addPlayer('jason'))
    .then(() => $.ajax(addPlayer('steven')));
}
