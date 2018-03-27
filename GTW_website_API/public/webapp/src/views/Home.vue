<template>
  <div class="home">
    <router-view></router-view>
    <h1>Global Thermonuclear War</h1>

    <h2>Game Instructions</h2>


    <div class="tabs is-toggle is-centered" id="tab_header">
      <ul>
        <li class="item is-active" data-option="1"><a>Goal</a></li>
        <li class="item" data-option="2"><a>Gameplay</a></li>
        <li class="item" data-option="3"><a>Peace</a></li>
        <li class="item" data-option="4"><a>War</a></li>
        <li class="item" data-option="5"><a>Nukes</a></li>
        <li class="item" data-option="6"><a>Forces</a></li>
        <li class="item" data-option="7"><a>R&D</a></li>
        <li class="item" data-option="8"><a>Continents</a></li>
      </ul>
    </div>


    <div class="box" id="tab_container">

      <div class="container_item is-active message-body instructions" data-item="1">
        <h3>
          The goal...
        </h3>
        <h4>
          You are an international power, pitted against the rest of the world
          in an arms race. Select territory, build your nuclear arsenal, and hope
          to gain global dominance without firing a single shot.

          You can win the game by having a declared arsenal that is twice the
          size of your next-strongest opponent. Or, if you're feeling lucky, by
          winning a global thermonuclear war...

          Do you feel lucky?
        </h4>
      </div>


      <div class="container_item message-body instructions" data-item="2">
        <h3>
          How to play...
        </h3>
        <h3>
          Game Start
        </h3>
        <h4>
          2 or 3 players can join the game. Once all players have joined, they
          will be assigned a random order in which to select their continents
          from the game board. They will select their continents one-at-a-time
          until all have been selected. (If there are 2 players, they get 3
          continents each. If there are 3 players, they get 2 continents each.)
        </h4>
      </div>


      <div class="container_item message-body instructions" data-item="3">
        <h3>
          "Peacetime"
        </h3>
        <h4>
          "Peacetime" is the main phase of the game. A year counter will begin
          at 1950 and each player will be given their budget.

          Players will spend their budgets deploying the three types of forces
          and/or spending on the two types of R&D. At any time, players can choose
          to "declare" any forces they have placed. These forces lose all stealth
          and become visible on the board, but are now counted towards the player's
          "declared forces" total. They can also choose to "disarm" forces, removing
          a previously-deployed force from the board. The player will no longer have
          to pay for the upkeep to that force.

          If one player's "declared forces" total is both greater than 10 and
          twice the size of the opponent with the next-highest "declared forces"
          total, that player wins the game!

          Note: At the beginning of each year, any non-declared forces may be
          "discovered" by other players' spies. Only the player whose spies have
          discovered the forces will know that they are there.

          When a player has finished taking all the actions they want to take for
          that year, they will then choose to end their year. When all players in
          the game have ended their year, a new year will begin. All players will
          then receive their budget for the new year (minus the upkeep cost of
          their existing forces).
        </h4>
      </div>


      <div class="container_item message-body instructions" data-item="4">
        <h3>
        War!
        </h3>
        <h4>
          If any player at <bold>any</bold> time chooses to declare war, the
          game enters <bold>War</bold> mode. Players will be able to fire
          missiles and launch bombers from their continents towards another
          player's continents.

          To launch a missile or bomber: Point at the missile or bomber icon on
          your continent. Then, drag towards the enemy content. The bomber or
          missile nuke will then begin a launch countdown to fire its nuke at
          the target continent.

          To launch a submarine-based missile: Press on the submarine that is
          your color in the ocean where your submarines are deployed, then drag
          to the target continent.

          You can continue to launch missiles and bombers from any of your
          continents for as long as that continent still has HP and there are still
          missiles/bombers to launch.

          When you no longer have a continent with any remaining HP, you lose.

          <bold>However</bold>, even if you have lost you can continue to launch
          any submarine-based missiles you have until you have used them all.
        </h4>
      </div>


      <div  class="container_item message-body instructions" data-item="5">
        <h3>
          Nukes
        </h3>
        <h4>
          Each nuke you launch will do 50 points of damage to the continent where
          it lands, plus an additional 5 points of damage for every level of
          "Damage R&D" you have reached.
        </h4>
      </div>


      <div class="container_item message-body instructions" data-item="6">
        <h3>
          Types of forces / The Tripod
        </h3>
        <h4>
          <ul>
            <li>ICBMs - Setup Cost: $100, Maintenance Cost: $20, Stealth: 7/10, Speed: 2</li>
            <li>Bombers - Setup Cost: $50, Maintenance Cost: $10, Stealth: 8/10, Speed: 1
            (Note: Range limited to targets within 0-1 distance.)</li>
            <li>Nuclear Subs - Setup Cost: $200, Maintenance Cost: $20, Stealth: 9/10, Speed: 2</li>
          </ul>
        </h4>
      </div>


      <div class="container_item message-body instructions" data-item="7">
        <h3>
          R&D
        </h3>
        <h4>
          R&D is your research and development budget. It can go into two areas:
          "Speed" or "Damage". For every $500 you spend on Damage R&D, your nukes
          will do an additional 5 points of damage. For every $500 you spend on Speed
          R&D your forces will have their speed increase by 1 (making their launch
          countdown faster).
        </h4>
      </div>


      <div class="container_item message-body instructions" data-item="8">
        <h3>
          Continents
        </h3>
          <!-- <ul> -->
            <h4 class="continents">North America - Budget: 1000 - HP: 500 - Oceans: AO, PO</h4>
            <h4 class="continents">South America - Budget: 750 - HP: 750 - Oceans: AO, PO</h4>
            <h4 class="continents">Asia - Budget: 500 - HP: 1000 - Oceans: IO, PO</h4>
            <h4 class="continents">Europe - Budget: 1100 - HP: 400 - Oceans: AO</h4>
            <h4 class="continents">Africa - Budget: 600 - HP: 900 - Oceans: AO, IO</h4>
            <h4 class="continents">Australia - Budget: 800 - HP: 700 - Oceans: IO, PO</h4>
          <!-- </ul> -->
          <h3 class="distance">Distance Table</h3>
          <h4>
          <table class="table">
            <tr>
              <th></th>
              <th>North America</th>
              <th>South America</th>
              <th>Europe</th>
              <th>Africa</th>
              <th>Asia</th>
              <th>Australia</th>
            </tr>
            <tr>
              <th>North America</th>
              <td></td>
              <td>0</td>
              <td>2</td>
              <td>3</td>
              <td>3</td>
              <td>4</td>
            </tr>
            <tr>
              <th>South America</th>
              <td>0</td>
              <td></td>
              <td>3</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
            </tr>
            <tr>
              <th>Europe</th>
              <td>2</td>
              <td>3</td>
              <td></td>
              <td>1</td>
              <td>0</td>
              <td>5</td>
            </tr>
            <tr>
              <th>Africa</th>
              <td>3</td>
              <td>2</td>
              <td>1</td>
              <td></td>
              <td>1</td>
              <td>3</td>
            </tr>
            <tr>
              <th>Asia</th>
              <td>3</td>
              <td>3</td>
              <td>0</td>
              <td>1</td>
              <td></td>
              <td>1</td>
            </tr>
            <tr>
              <th>Australia</th>
              <td>4</td>
              <td>4</td>
              <td>5</td>
              <td>3</td>
              <td>1</td>
              <td></td>
            </tr>
          </table>
        </h4>
      </div>

    </div>

    <div class="continue">
      <!-- <h3>Signin - Signup - or Continue without signing in.</h3> -->
      <a href="/login"><button class="button is-small is-danger">Sign In</button></a>
      <a href="/login/new"><button class="button is-small is-danger">Sign Up</button></a>
    </div>


  </div>
</template>


<script>
export default {
  name: 'Home',
  beforeMount() {
    $(document).ready(function jqtabs() { // eslint-disable-line
      $('#tab_header ul li.item').on('click', function jqtabscl() { // eslint-disable-line
        const number = $(this).data('option'); // eslint-disable-line
        $('#tab_header ul li.item').removeClass('is-active'); // eslint-disable-line
        $(this).addClass('is-active'); // eslint-disable-line
        $('#tab_container .container_item').removeClass('is-active'); // eslint-disable-line
        $('div[data-item="' + number + '"]').addClass('is-active'); // eslint-disable-line
      });
    });
  },
};
</script>


<!-- Added "scoped" attribute to limit CSS to this view only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

.home {
  background-image: url("../assets/blankMap.png");
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  font-family: $family-mono;
  padding-bottom: 30px;
  margin-bottom: -8px;
  height: 1200px;
}

#tab_container .container_item {
  display: none;
}

#tab_container .container_item.is-active {
  display: block;
}

.tabs.is-toggle a:hover {
  background-color: transparent;
  color: $text;
  border-color: $text;
}

.box {
  background-color: transparent;
}

button {
  margin-top: 10px;
}

button.is-small:active {
  color: $danger;
}

.message-body {
  background-color: rgba(0, 0, 0, 0.8);
}

.instructions {
  width: 55%;
  // width: 90%;
  margin: auto;
  margin-bottom: 40px;
  line-height: 1.6;
}

h1 {
  font-size: 44px;
  padding-top: 150px;
  color: $danger;
  margin-bottom: 50px;
}

h2 {
  font-size: 30px;
  color: $primary;
  margin-bottom: 50px;
}

h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: $primary;
}

h4 {
  font-size: 16px;
  font-family: monospace;
  font-weight: 100;
  text-align: justify;
  color: $text;
}

ul {
  list-style: disc;
  padding-left: 5px;
}

.continents {
  text-align: center;
}

.distance {
  margin-top: 20px;
}

.table {
  margin: auto;
  // background-color: #ffffff;
  border-radius: 5px;
  background-color:rgba(0, 0, 0, 0.8);
  color: white;
  border: 1px solid white;
}

.table thead th, .table tfoot th, .table th, .table td {
  text-align: center;
  color: white;
  font-size: 14px;
}

#app {
  text-align: center;
}
</style>
