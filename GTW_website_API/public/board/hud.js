const hud = new Vue({
  el: '#hud',
  data: {
    colors: colors,
    players: [],
    war: false,
    year: null,
    gameID: null,
  }
});

const gameOverModal = new Vue({
  el: '#gameOverModal',
  data: {
    messages: {
      overwhelming: 'overwhelming force',
      worldPeace: 'world peace',
      warWon: 'war',
      destroyed: 'total destruction',
    }
    outcome: null,
    winner: null,
  }
})
