const hud = new Vue({
  el: '#hud',
  data: {
    colors: colors.map(c => 'rgb(' + [(c & 0xff0000) >> 16,  (c & 0x00ff00) >> 8,  (c & 0x0000ff)] + ')'),
    test: 'yellow',
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
      rubble: 'world in rubble',
      overwhelming: 'overwhelming force',
      worldPeace: 'world peace',
      wonWar: 'war',
      destroyed: 'total destruction',
    },
    outcome: null,
    winner: null,
  },
  computed: {
    outcomeMessages: function() {
      return this.messages[this.outcome];
    }
  }
})
