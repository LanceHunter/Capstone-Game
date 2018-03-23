<template>
  <div class='Launchgame'>
    <router-view></router-view>
    <!-- <h1>Launch Game</h1> -->

    <!-- <div class='message-body'> -->
      <!-- <a href='/board'>
        <button class='button is-medium is-danger'>
          Sign In
          <span class='icon'>
            <i class='far fa-play-circle'></i>
          </span>
        </button>
      </a> -->

      <canvas id='scene'></canvas>
      <a href="/board"><input id="copy" type="text" value="Launch Game" /></a>

      <!-- <a href='/board' class='button is-medium is-danger'>
        <span>Launch Game</span>
        <span class='icon is-medium'>
        </span>
      </a> -->
    <!-- </div> -->
  </div>
</template>


<script>

function drawTitle() {
  let canvas = document.querySelector('#scene');
  let ctx = canvas.getContext('2d');
  let particles = [];
  let amount = 0;
  let mouse = {x:0,y:0};
  let radius = 1;

  let colors = ['white', '#5CC8FF', '#1A181B', '#E22245'];

  let copy = document.querySelector('#copy');

  let ww = canvas.width = window.innerWidth;
  let wh = canvas.height = window.innerHeight;

  function Particle(x,y){
  	this.x =  Math.random()*ww;
  	this.y =  Math.random()*wh;
  	this.dest = {
  		x : x,
  		y: y
  	};
  	this.r =  Math.random()*5 + 2;
  	this.vx = (Math.random()-0.5)*20;
  	this.vy = (Math.random()-0.5)*20;
  	this.accX = 0;
  	this.accY = 0;
  	this.friction = Math.random()*0.05 + 0.94; // 94

  	this.color = colors[Math.floor(Math.random()*6)];
  }

  Particle.prototype.render = function() {
  	this.accX = (this.dest.x - this.x)/1000;
  	this.accY = (this.dest.y - this.y)/1000;
  	this.vx += this.accX;
  	this.vy += this.accY;
  	this.vx *= this.friction;
  	this.vy *= this.friction;

  	this.x += this.vx;
  	this.y +=  this.vy;

  	ctx.fillStyle = this.color;
  	ctx.beginPath();
  	ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
  	ctx.fill();

  	let a = this.x - mouse.x;
  	let b = this.y - mouse.y;

  	let distance = Math.sqrt( a*a + b*b );
  	if(distance<(radius*60)){
  		this.accX = (this.x - mouse.x)/100;
  		this.accY = (this.y - mouse.y)/100;
  		this.vx += this.accX;
  		this.vy += this.accY;
  	}
  }

  function onMouseMove(e){
  	mouse.x = e.clientX;
  	mouse.y = e.clientY;
  }

  function onTouchMove(e){
    if(e.touches.length > 0 ){
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }

  function onTouchEnd(e){
    mouse.x = -9999;
    mouse.y = -9999;
  }

  function initScene(){
  	ww = canvas.width = window.innerWidth;
  	wh = canvas.height = window.innerHeight;

  	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	ctx.font = 'bold '+(ww/10)+'px sans-serif';
  	ctx.textAlign = 'center';
  	ctx.fillText(copy.value, ww/2, wh/2);

  	var data  = ctx.getImageData(0, 0, ww, wh).data;
  	ctx.clearRect(0, 0, canvas.width, canvas.height);
  	ctx.globalCompositeOperation = 'screen';

  	particles = [];
  	for(var i=0;i<ww;i+=Math.round(ww/150)){
  		for(var j=0;j<wh;j+=Math.round(ww/150)){
  			if(data[ ((i + j*ww)*4) + 3] > 150){
  				particles.push(new Particle(i,j));
  			}
  		}
  	}
  	amount = particles.length;
  }

  function onMouseClick(){
  	radius++;
  	if(radius ===5){
  		radius = 0;
  	}
  }

  function render(a) {
  	requestAnimationFrame(render);
  	ctx.clearRect(0, 0, canvas.width, canvas.height);
  	for (var i = 0; i < amount; i++) {
  		particles[i].render();
  	}
  };

  copy.addEventListener('keyup', initScene);
  window.addEventListener('resize', initScene);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchmove', onTouchMove);
  window.addEventListener('click', onMouseClick);
  window.addEventListener('touchend', onTouchEnd);

  initScene(),
  requestAnimationFrame(render)
}


export default {
  name: 'LaunchGame',
  beforeMount(){
    $(document).ready(function jqtabs() {
      drawTitle();
    });
  }
};
</script>


<!-- Added 'scoped' attribute to limit CSS to this view only -->
<style lang='scss' scoped>
@import '../assets/main.sass';

.Launchgame {
  // background-color: #303030;
  background-image: url('../assets/blankMap.png');
  background-position: top;
  background-size: cover;
  font-family: $family-mono;
  height: 900px;
  margin-bottom: -8px;
}

// h1 {
//   padding: 120px 0px 60px 0px;
//   font-size: 40px;
//   font-family: $family-mono;
//   color: $danger;
// }

a.button.is-medium.is-danger {
  margin-top: 430px;
  text-align: center;
}

/* body{
	margin:0;
	overflow: hidden;
	font-size:0;
} */

canvas{
	/* background: black; */
  background-color: rgba(0, 0, 0, 0.4);
	width: 100vw;
	height: 100vh;
}

input{
	width: 250px;
	height: 40px;
	line-height: 40px;
	position: absolute;
	bottom: 35px;
	left: calc(50% - 125px);
	background: none;
	color: white;
	font-size: 30px;
	font-family: arial;
	text-align: center;
	border: 1px solid white;
	background: rgba(255,255,255,0.2);
}


#app {
  text-align: center;
}
</style>
