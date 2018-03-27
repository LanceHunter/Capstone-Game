(function() {

  const database = firebase.database();

  let gameID = `game988`;
  let gameInstance = database.ref(`gameInstance/${gameID}`);

  gameInstance.on('value', (snap) => {
    mobileGame.gameData = snap.val();
  });


  const mobileGame = new Vue({
    el : '#mobilePage',
    data : {
      gameData : 0,
      userName : '',
      init : true,
      joined : false,
      myPlayerID : ''
    },
    methods : {
      joinGame : function() {
        let ajaxSettings = {
          type : 'PUT',
          url : "localhost:3000/api/pregame/joingame",
          data : JSON.stringify({
            "gameID" : gameID,
            "playerID" : this.myPlayerID
          })
        };
        $.ajax(ajaxSettings).always((data) => {
          console.log('This is the data - ', data);
          this.init = false;
        })
      }


    }
  });

})();
