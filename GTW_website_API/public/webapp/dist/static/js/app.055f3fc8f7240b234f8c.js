webpackJsonp([1],{"1B1b":function(t,e){},"38B+":function(t,e){},"8uAX":function(t,e){},LpNf:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("7+uW"),n=a("//Fk"),i=a.n(n),r=a("mtWM"),o=a.n(r),c=o.a.create({baseURL:"http://localhost:3000/api"}),l={login:function(t,e){return new i.a(function(a,s){c.post("/login",{username:t,password:e}).then(function(e){localStorage.setItem("username",t),a(e)}).catch(function(t){s(t)})})},create:function(t,e){return new i.a(function(a,s){c.post("/register",{username:t,password:e}).then(function(t){a(t)}).catch(function(t){s(t)})})},logout:function(){localStorage.removeItem("username")},getUser:function(){return localStorage.getItem("username")},isLoggedIn:function(){return!!localStorage.getItem("username")}};document.addEventListener("DOMContentLoaded",function(){var t=Array.prototype.slice.call(document.querySelectorAll(".navbar-burger"),0);t.length>0&&t.forEach(function(t){t.addEventListener("click",function(){var e=t.dataset.target,a=document.getElementById(e);t.classList.toggle("is-active"),a.classList.toggle("is-active")})})});var v={name:"TheNavbar",data:function(){return{username:l.getUser()}},methods:{logout:function(){l.logout()}},watch:{$route:function(t,e){"/"===t.path&&(this.username=l.getUser())}}},d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("nav",{staticClass:"navbar is-fixed-top",attrs:{role:"navigation","aria-label":"main navigation"}},[t._m(0),t._v(" "),a("div",{staticClass:"navbar-menu",attrs:{id:"navMenu"}},[a("div",{staticClass:"navbar-start"},[a("a",{staticClass:"navbar-item",attrs:{href:"/"}},[t._v("\n          Home\n        ")]),t._v(" "),t.username?t._e():a("a",{staticClass:"navbar-item",attrs:{href:"/login"}},[t._v("\n          Login\n        ")]),t._v(" "),t.username?a("a",{staticClass:"navbar-item",attrs:{href:"/launchgame"}},[t._v("\n          Launch game\n        ")]):t._e(),t._v(" "),t.username?a("a",{staticClass:"navbar-item",attrs:{href:"/leaderboard"}},[t._v("\n          Leaderboard\n        ")]):t._e(),t._v(" "),t.username?a("a",{staticClass:"navbar-item",attrs:{href:"/stats/"+t.username}},[t._v("\n          My stats\n        ")]):t._e(),t._v(" "),t.username?a("a",{staticClass:"navbar-item",attrs:{href:"/"},on:{click:t.logout}},[t._v("\n          Logout\n        ")]):t._e()]),t._v(" "),a("div",{staticClass:"navbar-end"})])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"navbar-brand"},[e("div",{staticClass:"navbar-burger",attrs:{"data-target":"navMenu"}},[e("span"),this._v(" "),e("span"),this._v(" "),e("span"),this._v(" "),e("span"),this._v(" "),e("span")])])}]};var h={name:"App",components:{TheNavbar:a("VU/8")(v,d,!1,function(t){a("VNaE")},"data-v-7a5bdede",null).exports}},u={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("the-navbar"),this._v(" "),e("router-view")],1)},staticRenderFns:[]};var _=a("VU/8")(h,u,!1,function(t){a("itqb")},"data-v-0ac5f5eb",null).exports,m=a("/ocq"),g={name:"Home",beforeMount:function(){$(document).ready(function(){$("#tab_header ul li.item").on("click",function(){var t=$(this).data("option");$("#tab_header ul li.item").removeClass("is-active"),$(this).addClass("is-active"),$("#tab_container .container_item").removeClass("is-active"),$('div[data-item="'+t+'"]').addClass("is-active")})})}},f={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"home"},[a("router-view"),t._v(" "),a("h1",[t._v("Global Thermonuclear War")]),t._v(" "),a("h2",[t._v("Game Instructions")]),t._v(" "),t._m(0),t._v(" "),a("div",{staticClass:"box",attrs:{id:"tab_container"}},[t._m(1),t._v(" "),t._m(2),t._v(" "),t._m(3),t._v(" "),a("div",{staticClass:"container_item message-body instructions",attrs:{"data-item":"4"}},[a("h3",[t._v("\n      War!\n      ")]),t._v(" "),a("h4",[t._v("\n        If any player at "),a("bold",[t._v("any")]),t._v(" time chooses to declare war, the\n        game enters "),a("bold",[t._v("War")]),t._v(" mode. Players will be able to fire\n        missiles and launch bombers from their continents towards another\n        player's continents.\n\n        To launch a missile or bomber: Point at the missile or bomber icon on\n        your continent. Then, drag towards the enemy content. The bomber or\n        missile nuke will then begin a launch countdown to fire its nuke at\n        the target continent.\n\n        To launch a submarine-based missile: Press on the submarine that is\n        your color in the ocean where your submarines are deployed, then drag\n        to the target continent.\n\n        You can continue to launch missiles and bombers from any of your\n        continents for as long as that continent still has HP and there are still\n        missiles/bombers to launch.\n\n        When you no longer have a continent with any remaining HP, you lose.\n\n        "),a("bold",[t._v("However")]),t._v(", even if you have lost you can continue to launch\n        any submarine-based missiles you have until you have used them all.\n      ")],1)]),t._v(" "),t._m(4),t._v(" "),t._m(5),t._v(" "),t._m(6),t._v(" "),t._m(7)]),t._v(" "),t._m(8)],1)},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"tabs is-toggle is-centered",attrs:{id:"tab_header"}},[a("ul",[a("li",{staticClass:"item is-active",attrs:{"data-option":"1"}},[a("a",[t._v("Goal")])]),t._v(" "),a("li",{staticClass:"item",attrs:{"data-option":"2"}},[a("a",[t._v("Gameplay")])]),t._v(" "),a("li",{staticClass:"item",attrs:{"data-option":"3"}},[a("a",[t._v("Peace")])]),t._v(" "),a("li",{staticClass:"item",attrs:{"data-option":"4"}},[a("a",[t._v("War")])]),t._v(" "),a("li",{staticClass:"item",attrs:{"data-option":"5"}},[a("a",[t._v("Nukes")])]),t._v(" "),a("li",{staticClass:"item",attrs:{"data-option":"6"}},[a("a",[t._v("Forces")])]),t._v(" "),a("li",{staticClass:"item",attrs:{"data-option":"7"}},[a("a",[t._v("R&D")])]),t._v(" "),a("li",{staticClass:"item",attrs:{"data-option":"8"}},[a("a",[t._v("Continents")])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"container_item is-active message-body instructions",attrs:{"data-item":"1"}},[e("h3",[this._v("\n        The goal...\n      ")]),this._v(" "),e("h4",[this._v("\n        You are an international power, pitted against the rest of the world\n        in an arms race. Select territory, build your nuclear arsenal, and hope\n        to gain global dominance without firing a single shot.\n\n        You can win the game by having a declared arsenal that is twice the\n        size of your next-strongest opponent. Or, if you're feeling lucky, by\n        winning a global thermonuclear war...\n\n        Do you feel lucky?\n      ")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"container_item message-body instructions",attrs:{"data-item":"2"}},[e("h3",[this._v("\n        How to play...\n      ")]),this._v(" "),e("h3",[this._v("\n        Game Start\n      ")]),this._v(" "),e("h4",[this._v("\n        2 or 3 players can join the game. Once all players have joined, they\n        will be assigned a random order in which to select their continents\n        from the game board. They will select their continents one-at-a-time\n        until all have been selected. (If there are 2 players, they get 3\n        continents each. If there are 3 players, they get 2 continents each.)\n      ")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"container_item message-body instructions",attrs:{"data-item":"3"}},[e("h3",[this._v('\n        "Peacetime"\n      ')]),this._v(" "),e("h4",[this._v('\n        "Peacetime" is the main phase of the game. A year counter will begin\n        at 1950 and each player will be given their budget.\n\n        Players will spend their budgets deploying the three types of forces\n        and/or spending on the two types of R&D. At any time, players can choose\n        to "declare" any forces they have placed. These forces lose all stealth\n        and become visible on the board, but are now counted towards the player\'s\n        "declared forces" total. They can also choose to "disarm" forces, removing\n        a previously-deployed force from the board. The player will no longer have\n        to pay for the upkeep to that force.\n\n        If one player\'s "declared forces" total is both greater than 10 and\n        twice the size of the opponent with the next-highest "declared forces"\n        total, that player wins the game!\n\n        Note: At the beginning of each year, any non-declared forces may be\n        "discovered" by other players\' spies. Only the player whose spies have\n        discovered the forces will know that they are there.\n\n        When a player has finished taking all the actions they want to take for\n        that year, they will then choose to end their year. When all players in\n        the game have ended their year, a new year will begin. All players will\n        then receive their budget for the new year (minus the upkeep cost of\n        their existing forces).\n      ')])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"container_item message-body instructions",attrs:{"data-item":"5"}},[e("h3",[this._v("\n        Nukes\n      ")]),this._v(" "),e("h4",[this._v('\n        Each nuke you launch will do 50 points of damage to the continent where\n        it lands, plus an additional 5 points of damage for every level of\n        "Damage R&D" you have reached.\n      ')])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"container_item message-body instructions",attrs:{"data-item":"6"}},[e("h3",[this._v("\n        Types of forces / The Tripod\n      ")]),this._v(" "),e("h4",[e("ul",[e("li",[this._v("ICBMs - Setup Cost: $100, Maintenance Cost: $20, Stealth: 7/10, Speed: 2")]),this._v(" "),e("li",[this._v("Bombers - Setup Cost: $50, Maintenance Cost: $10, Stealth: 8/10, Speed: 1\n          (Note: Range limited to targets within 0-1 distance.)")]),this._v(" "),e("li",[this._v("Nuclear Subs - Setup Cost: $200, Maintenance Cost: $20, Stealth: 9/10, Speed: 2")])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"container_item message-body instructions",attrs:{"data-item":"7"}},[e("h3",[this._v("\n        R&D\n      ")]),this._v(" "),e("h4",[this._v('\n        R&D is your research and development budget. It can go into two areas:\n        "Speed" or "Damage". For every $500 you spend on Damage R&D, your nukes\n        will do an additional 5 points of damage. For every $500 you spend on Speed\n        R&D your forces will have their speed increase by 1 (making their launch\n        countdown faster).\n      ')])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container_item message-body instructions",attrs:{"data-item":"8"}},[a("h3",[t._v("\n        Continents\n      ")]),t._v(" "),a("h4",{staticClass:"continents"},[t._v("North America - Budget: 1000 - HP: 500 - Oceans: AO, PO")]),t._v(" "),a("h4",{staticClass:"continents"},[t._v("South America - Budget: 750 - HP: 750 - Oceans: AO, PO")]),t._v(" "),a("h4",{staticClass:"continents"},[t._v("Asia - Budget: 500 - HP: 1000 - Oceans: IO, PO")]),t._v(" "),a("h4",{staticClass:"continents"},[t._v("Europe - Budget: 1100 - HP: 400 - Oceans: AO")]),t._v(" "),a("h4",{staticClass:"continents"},[t._v("Africa - Budget: 600 - HP: 900 - Oceans: AO, IO")]),t._v(" "),a("h4",{staticClass:"continents"},[t._v("Australia - Budget: 800 - HP: 700 - Oceans: IO, PO")]),t._v(" "),a("h3",{staticClass:"distance"},[t._v("Distance Table")]),t._v(" "),a("h4",[a("table",{staticClass:"table"},[a("tr",[a("th"),t._v(" "),a("th",[t._v("North America")]),t._v(" "),a("th",[t._v("South America")]),t._v(" "),a("th",[t._v("Europe")]),t._v(" "),a("th",[t._v("Africa")]),t._v(" "),a("th",[t._v("Asia")]),t._v(" "),a("th",[t._v("Australia")])]),t._v(" "),a("tr",[a("th",[t._v("North America")]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("0")]),t._v(" "),a("td",[t._v("2")]),t._v(" "),a("td",[t._v("3")]),t._v(" "),a("td",[t._v("3")]),t._v(" "),a("td",[t._v("4")])]),t._v(" "),a("tr",[a("th",[t._v("South America")]),t._v(" "),a("td",[t._v("0")]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("3")]),t._v(" "),a("td",[t._v("2")]),t._v(" "),a("td",[t._v("3")]),t._v(" "),a("td",[t._v("4")])]),t._v(" "),a("tr",[a("th",[t._v("Europe")]),t._v(" "),a("td",[t._v("2")]),t._v(" "),a("td",[t._v("3")]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("1")]),t._v(" "),a("td",[t._v("0")]),t._v(" "),a("td",[t._v("5")])]),t._v(" "),a("tr",[a("th",[t._v("Africa")]),t._v(" "),a("td",[t._v("3")]),t._v(" "),a("td",[t._v("2")]),t._v(" "),a("td",[t._v("1")]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("1")]),t._v(" "),a("td",[t._v("3")])]),t._v(" "),a("tr",[a("th",[t._v("Asia")]),t._v(" "),a("td",[t._v("3")]),t._v(" "),a("td",[t._v("3")]),t._v(" "),a("td",[t._v("0")]),t._v(" "),a("td",[t._v("1")]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("1")])]),t._v(" "),a("tr",[a("th",[t._v("Australia")]),t._v(" "),a("td",[t._v("4")]),t._v(" "),a("td",[t._v("4")]),t._v(" "),a("td",[t._v("5")]),t._v(" "),a("td",[t._v("3")]),t._v(" "),a("td",[t._v("1")]),t._v(" "),a("td")])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"continue"},[e("a",{attrs:{href:"/login"}},[e("button",{staticClass:"button is-small is-danger"},[this._v("Sign In")])]),this._v(" "),e("a",{attrs:{href:"/login/new"}},[e("button",{staticClass:"button is-small is-danger"},[this._v("Sign Up")])])])}]};var p=a("VU/8")(g,f,!1,function(t){a("urZC")},"data-v-12614de8",null).exports,C={name:"Login",data:function(){return{username:null,password:null,repeate:!1}},methods:{loginToggle:function(){console.log("was logged in:",l.isLoggedIn()),l.isLoggedIn()?(l.logout(),console.log("now logged in:",l.isLoggedIn())):l.login("test0","password").then(function(){console.log("now logged in:",l.isLoggedIn())})},tryLogin:function(t,e){var a=this;l.login(t,e).then(function(t){console.log("succeded with:",t),a.$router.push({name:"Home"})}).catch(function(t){console.log("failed with:",t),a.repeate=!0})}}},y={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"login"},[a("router-view"),t._v(" "),a("h1",[t._v("Login")]),t._v(" "),a("div",{staticClass:"message-body"},[t.repeate?a("div",{staticClass:"is-small has-text-danger"},[a("p",[t._v("Invalid credentials, try again")])]):t._e(),t._v(" "),a("form",{on:{submit:function(e){e.preventDefault(),t.tryLogin(t.username,t.password)}}},[a("div",{staticClass:"field top"},[a("p",{staticClass:"control is-small has-icons-left"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.username,expression:"username"}],staticClass:"input is-small",attrs:{type:"text",placeholder:"Player Name"},domProps:{value:t.username},on:{input:function(e){e.target.composing||(t.username=e.target.value)}}}),t._v(" "),t._m(0)])]),t._v(" "),a("div",{staticClass:"field"},[a("p",{staticClass:"control has-icons-left"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"input is-small",attrs:{type:"password",placeholder:"Password"},domProps:{value:t.password},on:{input:function(e){e.target.composing||(t.password=e.target.value)}}}),t._v(" "),t._m(1)])]),t._v(" "),t._m(2)])])],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"icon is-small is-left"},[e("i",{staticClass:"fas fa-user"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"icon is-small is-left"},[e("i",{staticClass:"fas fa-lock"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"field bottom"},[e("p",{staticClass:"control"},[e("button",{staticClass:"button is-small is-danger",attrs:{type:"submit"}},[this._v("Login")]),this._v(" "),e("a",{staticClass:"button is-small is-danger",attrs:{href:"/login/new"}},[this._v("Sign Up")])])])}]};var b=a("VU/8")(C,y,!1,function(t){a("LpNf")},"data-v-21bbc049",null).exports;var w={name:"LaunchGame",beforeMount:function(){$(document).ready(function(){!function(){var t=document.querySelector("#scene"),e=t.getContext("2d"),a=[],s=0,n={x:0,y:0},i=1,r=["#780116","white","#C20114","#5CC8FF","#780116","grey","#E22245"],o=document.querySelector("#copy"),c=t.width=window.innerWidth,l=t.height=window.innerHeight;function v(t,e){this.x=Math.random()*c,this.y=Math.random()*l,this.dest={x:t,y:e},this.r=5*Math.random()+2,this.vx=20*(Math.random()-.5),this.vy=20*(Math.random()-.5),this.accX=0,this.accY=0,this.friction=.05*Math.random()+.94,this.color=r[Math.floor(6*Math.random())]}function d(){c=t.width=window.innerWidth,l=t.height=window.innerHeight,e.clearRect(0,0,t.width,t.height),e.font="bold "+c/10+"px sans-serif",e.textAlign="center",e.fillText(o.value,c/2,l/2);var n=e.getImageData(0,0,c,l).data;e.clearRect(0,0,t.width,t.height),e.globalCompositeOperation="screen",a=[];for(var i=0;i<c;i+=Math.round(c/150))for(var r=0;r<l;r+=Math.round(c/150))n[4*(i+r*c)+3]>150&&a.push(new v(i,r));s=a.length}v.prototype.render=function(){this.accX=(this.dest.x-this.x)/1e3,this.accY=(this.dest.y-this.y)/1e3,this.vx+=this.accX,this.vy+=this.accY,this.vx*=this.friction,this.vy*=this.friction,this.x+=this.vx,this.y+=this.vy,e.fillStyle=this.color,e.beginPath(),e.arc(this.x,this.y,this.r,2*Math.PI,!1),e.fill();var t=this.x-n.x,a=this.y-n.y;Math.sqrt(t*t+a*a)<60*i&&(this.accX=(this.x-n.x)/100,this.accY=(this.y-n.y)/100,this.vx+=this.accX,this.vy+=this.accY)},o.addEventListener("keyup",d),window.addEventListener("resize",d),window.addEventListener("mousemove",function(t){n.x=t.clientX,n.y=t.clientY}),window.addEventListener("touchmove",function(t){t.touches.length>0&&(n.x=t.touches[0].clientX,n.y=t.touches[0].clientY)}),window.addEventListener("click",function(){5==++i&&(i=0)}),window.addEventListener("touchend",function(t){n.x=-9999,n.y=-9999}),d(),requestAnimationFrame(function n(i){requestAnimationFrame(n),e.clearRect(0,0,t.width,t.height);for(var r=0;r<s;r++)a[r].render()})}()})}},L={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"Launchgame"},[e("router-view"),this._v(" "),e("canvas",{attrs:{id:"scene"}}),this._v(" "),this._m(0)],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("a",{attrs:{href:"/board"}},[e("input",{attrs:{id:"copy",type:"text",value:"Launch Game"}})])}]};var x=a("VU/8")(w,L,!1,function(t){a("1B1b")},"data-v-0532e854",null).exports,E=o.a.create({baseURL:"http://localhost:3000/api/stats"}),k={leaders:function(t){return new i.a(function(e,a){E.get("/leaders?order="+t).then(function(t){e(t.data.leaders)}).catch(function(t){a(t)})})},user:function(t){return new i.a(function(e,a){E.get("/"+t).then(function(t){e(t.data.stats)}).catch(function(t){a(t)})})}},P={name:"Leaderboard",data:function(){return{leaders:null}},methods:{getLeaders:function(t){var e=this;k.leaders(t).then(function(t){t.forEach(function(t,e){t.rank=e+1}),e.leaders=t})}},beforeMount:function(){this.getLeaders("percentage")}},A={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"Leaderboard"},[a("router-view"),t._v(" "),a("h1",[t._v("Leaderboard")]),t._v(" "),a("table",{staticClass:"table"},[a("thead",[a("tr",[a("th",{staticClass:"headfoot"},[t._v("Rank")]),t._v(" "),a("th",{staticClass:"headfoot"},[t._v("Player Name")]),t._v(" "),a("th",{staticClass:"headfoot",on:{click:function(e){t.getLeaders("percentage")}}},[t._v("Win Percentage")]),t._v(" "),a("th",{staticClass:"headfoot",on:{click:function(e){t.getLeaders("wins")}}},[t._v("Win-Loss")]),t._v(" "),a("th",{staticClass:"headfoot",on:{click:function(e){t.getLeaders("high")}}},[t._v("High Score")]),t._v(" "),a("th",{staticClass:"headfoot",on:{click:function(e){t.getLeaders("average")}}},[t._v("Average Score")]),t._v(" "),a("th",{staticClass:"headfoot"},[t._v("Dashboard")])])]),t._v(" "),a("tfoot",[a("tr",[a("th",{staticClass:"headfoot"},[t._v("Rank")]),t._v(" "),a("th",{staticClass:"headfoot"},[t._v("Player Name")]),t._v(" "),a("th",{staticClass:"headfoot",on:{click:function(e){t.getLeaders("percentage")}}},[t._v("Win Percentage")]),t._v(" "),a("th",{staticClass:"headfoot",on:{click:function(e){t.getLeaders("wins")}}},[t._v("Win-Loss")]),t._v(" "),a("th",{staticClass:"headfoot",on:{click:function(e){t.getLeaders("high")}}},[t._v("High Score")]),t._v(" "),a("th",{staticClass:"headfoot",on:{click:function(e){t.getLeaders("average")}}},[t._v("Average Score")]),t._v(" "),a("th",{staticClass:"headfoot"},[t._v("Dashboard")])])]),t._v(" "),a("tbody",t._l(t.leaders,function(e){return a("tr",{key:e.rank},[a("th",[t._v(" "+t._s(e.rank)+" ")]),t._v(" "),a("td",[t._v(" "+t._s(e.username)+" ")]),t._v(" "),a("td",[t._v(" "+t._s(Number(e.win_percentage).toFixed(1)+"%")+" ")]),t._v(" "),a("td",[t._v(" "+t._s(e.wins)+" - "+t._s(e.losses)+" ")]),t._v(" "),a("td",[t._v(" "+t._s(e.high_score)+" ")]),t._v(" "),a("td",[t._v(" "+t._s(e.average_score)+" ")]),t._v(" "),a("td",[a("a",{attrs:{href:"/stats/"+e.username}},[a("i",{staticClass:"fas fa-tachometer-alt"})])])])}))]),t._v(" "),t._m(0)],1)},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"clock"},[a("div",{staticClass:"digit hours"},[a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"})]),t._v(" "),a("div",{staticClass:"digit hours"},[a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"})]),t._v(" "),a("div",{staticClass:"separator"}),t._v(" "),a("div",{staticClass:"digit minutes"},[a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"})]),t._v(" "),a("div",{staticClass:"digit minutes"},[a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"})]),t._v(" "),a("div",{staticClass:"separator"}),t._v(" "),a("div",{staticClass:"digit seconds"},[a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"})]),t._v(" "),a("div",{staticClass:"digit seconds"},[a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"}),t._v(" "),a("div",{staticClass:"segment"})])])}]};var S=a("VU/8")(P,A,!1,function(t){a("qEXD")},"data-v-8641673c",null).exports,I=a("vwbq");var M={name:"Playerstats",data:function(){return{stats:null}},methods:{getStats:function(t){var e=this;k.user(t).then(function(t){e.stats=t,function(t){var e=30,a=20,s=70,n=50,i=900-n-a,r=500-e-s,o=(I.timeParse("%B %b, %Y"),I.scaleTime().range([0,i])),c=I.scaleLinear().range([r,0]),l=I.line().x(function(t){return console.log("Ln 38: date on x axis: ",t.date),o(t.date)}).y(function(t){return c(t.price)}),v=I.select("#chart").append("svg").attr("width",i+n+a).attr("height",r+e+s).append("g").attr("transform","translate("+n+","+e+")");console.log("Ln 54: these are the stats: ",t),t.forEach(function(t){console.log("Ln 59: this is d: ",t),console.log("Ln 60: date: ",t.end_time),t.date=new Date(t.end_time),console.log("Ln 62: parsed date: ",t.date),t.score=+t.score}),o.domain(I.extent(t,function(t){return t.date})),c.domain([0,I.max(t,function(t){return t.score})]);var d=I.nest().key(function(t){return t.symbol}).entries(t),h=I.scaleOrdinal(I.schemeCategory10),u=i/d.length;d.forEach(function(t,e){console.log("Ln 89: another d: ",t),console.log("Ln 90: d.values: ",t.values),v.append("path").attr("class","line").style("stroke",function(){return t.color=h(t.key)}).attr("d",l(t.values)),v.append("text").attr("x",u/2+e*u).attr("y",r+s/2+5).attr("class","legend").style("fill",function(){return t.color=h(t.key)}).on("click",function(){var e=!t.active,a=e?0:1;I.select("#tag"+t.key.replace(/\s+/g,"")).transition().duration(100).style("opacity",a),t.active=e}).text(t.key)}),v.append("g").attr("class","axis").attr("transform","translate(0,"+r+")").call(I.axisBottom(o)),v.append("g").attr("class","axis").call(I.axisLeft(c))}(t),console.log("set stats to:",e.stats)})}},beforeMount:function(){this.getStats(this.$route.params.username)}},O={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"Playerstats"},[e("router-view"),this._v(" "),e("h1",[this._v("My Statistics")]),this._v(" "),e("div",{staticClass:"message-body"},[e("svg",{attrs:{id:"chart",width:"1000",height:"500"}})])],1)},staticRenderFns:[]};var N=a("VU/8")(M,O,!1,function(t){a("8uAX")},"data-v-63a6b73c",null).exports,R={name:"CreateAccount",data:function(){return{username:null,password:null,confirmPassword:null,errorMsg:null}},methods:{tryCreate:function(t,e,a){var s=this;e!==a?this.errorMsg="Passwords do not match, try again.":l.create(t,e).then(function(t){s.$router.push({name:"Login"})}).catch(function(t){s.errorMsg="Username taken, try again."})}}},T={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"login"},[a("router-view"),t._v(" "),a("h1",[t._v("Create Account")]),t._v(" "),a("div",{staticClass:"message-body"},[t.errorMsg?a("div",{staticClass:"is-small has-text-danger"},[a("p",[t._v(t._s(t.errorMsg))])]):t._e(),t._v(" "),a("form",{on:{submit:function(e){e.preventDefault(),t.tryCreate(t.username,t.password,t.confirmPassword)}}},[a("div",{staticClass:"field top"},[a("p",{staticClass:"control is-small has-icons-left"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.username,expression:"username"}],staticClass:"input is-small",attrs:{type:"text",placeholder:"Player Name"},domProps:{value:t.username},on:{input:function(e){e.target.composing||(t.username=e.target.value)}}}),t._v(" "),t._m(0)])]),t._v(" "),a("div",{staticClass:"field"},[a("p",{staticClass:"control has-icons-left"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"input is-small",attrs:{type:"password",placeholder:"Password"},domProps:{value:t.password},on:{input:function(e){e.target.composing||(t.password=e.target.value)}}}),t._v(" "),t._m(1)])]),t._v(" "),a("div",{staticClass:"field"},[a("p",{staticClass:"control has-icons-left"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.confirmPassword,expression:"confirmPassword"}],staticClass:"input is-small",attrs:{type:"password",placeholder:"Confirm Password"},domProps:{value:t.confirmPassword},on:{input:function(e){e.target.composing||(t.confirmPassword=e.target.value)}}}),t._v(" "),t._m(2)])]),t._v(" "),t._m(3)])])],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"icon is-small is-left"},[e("i",{staticClass:"fas fa-user"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"icon is-small is-left"},[e("i",{staticClass:"fas fa-lock"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"icon is-small is-left"},[e("i",{staticClass:"fas fa-lock"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"field bottom"},[e("p",{staticClass:"control"},[e("button",{staticClass:"button is-small is-danger",attrs:{type:"submit"}},[this._v("Login")])])])}]};var D=a("VU/8")(R,T,!1,function(t){a("38B+")},"data-v-741e6df2",null).exports;s.a.use(m.a);var U,H=new m.a({mode:"history",routes:[{path:"/",name:"Home",component:p},{path:"/login",name:"Login",component:b},{path:"/login/new",name:"CreateAccount",component:D},{path:"/launchgame",name:"LaunchGame",component:x,meta:{requiresAuth:!0}},{path:"/leaderboard",name:"Leaderboard",component:S,meta:{requiresAuth:!0}},{path:"/stats/:username",name:"Playerstats",component:N,meta:{requiresAuth:!0}}]}),F=a("bOdI"),q=a.n(F),B=a("NYxO"),W=a("Rf8U"),G=a.n(W);s.a.use(B.a,G.a,o.a);var Y=new B.a.Store({state:{user:{},isLoggedIn:!!localStorage.getItem("token")},mutations:(U={},q()(U,"LOGIN",function(t,e){t.isLoggedIn=!0,t.user=e}),q()(U,"LOGOUT",function(t){t.isLoggedIn=!1,t.user={}}),U),actions:{login:function(t,e){var a=t.commit;return new i.a(function(t){setTimeout(function(){localStorage.setItem("token",e),a("LOGIN_SUCCESS"),t()},1e3)})},logout:function(t){var e=t.commit;localStorage.removeItem("token"),e("LOGOUT")}},getters:{currentUser:function(t){return t.user},isLoggedIn:function(t){return t.isLoggedIn}}});s.a.config.productionTip=!1,H.beforeEach(function(t,e,a){t.matched.some(function(t){return t.meta.requiresAuth})&&!l.isLoggedIn()?a("/login"):a()}),new s.a({el:"#app",router:H,store:Y,components:{App:_},template:"<App/>"})},VNaE:function(t,e){},itqb:function(t,e){},qEXD:function(t,e){},urZC:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.055f3fc8f7240b234f8c.js.map