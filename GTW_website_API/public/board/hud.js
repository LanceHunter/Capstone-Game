let hud = new Vue({
  el: '#hud',
  data: {
    players: null,
    war: false,
    year: null,
    gameID: null
  }
});

let canvasLeft = $('canvas').offset().left;
$('.hudcontainer').css('left', canvasLeft);
