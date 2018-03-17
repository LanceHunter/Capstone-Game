<template>
  <div class="home">
    <router-view></router-view>
    <h1>Global Thermonuclear War</h1>

    <h2>Game Instructions</h2>

    <div class="instructions">
      <h3>
        The goal...
      </h3>
      <h4>
        In this game, you play as an international power, pitted against other powers in an arms race. You select territory, build your nuclear arsenal, and hope to gain global dominance without firing a single shot.

        You can win the game by having a declared arsenal that is twice the size of your next-strongest opponent. Or, if you're feeling lucky, by winning a global thermonuclear war...

        Do you feel lucky?
      </h4>
    </div>

    <div class="instructions">
      <h3>
        How to play...
      </h3>
      <h3>
        Game Start
      </h3>
      <h4>
        2-6 players will join the game. Once all players have joined, they will be assigned a random order in which to select their continents from the game board. They will select their continents one-at-a-time until all have been selected. (If there are 2 players, they get 3 continents each. If there are 3 players, they get 2 continents each. If there are 4, 5, or 6 players they will all only get one continent.)
      </h4>
    </div>

      <div class="instructions">
        <h3>
          "Peacetime"
        </h3>
        <h4>
          "Peacetime" is the main phase of the game. A year counter will begin at 1950 and each player will be given their budget. A new year will begin every 60 seconds.

          All players will spend that budget between deploying the three types of forces and/or R&D. As the year ends, the players can choose to "declare" any forces they have placed. These forces lose all stealth but are now counted towards the player's "declared forces" total. They can also choose to "disarm" forces, removing a previously-declared force from the board. The player will no longer have to pay for the upkeep to that force.

          If one player's "declared forces" total is both greater than 10 and twice the size of the opponent with the next-highest "declared forces" total, that player wins the game!

          Note: At the beginning of each year, any non-declared forces may be "discovered" by other players. Only the player who has discovered the forces will know that they are there.
        </h4>
      </div>

      <div class="instructions">
        <h3>
        War!
        </h3>
        <h4>
          If any player at any time chooses to declare war, the game enters War mode. Players will be able to fire missiles and launch bombers from their continent(s) towards other player's continents.

          To launch a missile or bomber: Press and hold on your continent as the missile powers up. Then, drag that missile towards the enemy content. (Note: If bombers are available they will always be used first unless the target continent is outside of their range.)

          To launch a submarine-based missile: Press and hold on the ocean where your submarines are deployed and then drag to the target continent.

          You can continue to launch missiles and bombers from any of your continents as long as that continent still has HP and there are still missiles/bombers to launch. When you no longer have a continent with any remaining HP, you lose.

          However, even if you have lost you can continue to launch any submarine-based missiles you have until you have used them all.
        </h4>
      </div>

    <div  class="instructions">
      <h3>
        Nukes
      </h3>
      <h4>
        Each nuke you launch will do 50 points of damage to the continent where it lands, plus an additional 5 points of damage for every level of "Damage R&D" you have reached.
      </h4>
    </div>

    <div class="instructions">
      <h3>
        Types of forces / The Tripod
      </h3>
      <h4>
        ICBMs - Setup Cost: $100, Maintenance Cost: $20, Stealth: 7/10, Speed: 2
        Bombers - Setup Cost: $50, Maintenance Cost: $10, Stealth: 8/10, Speed: 1 (Note: Range limited to targets within 0-1 distance.)
        Nuclear Subs - Setup Cost: $200, Maintenance Cost: $20, Stealth: 9/10, Speed: 2
      </h4>
    </div>

    <div class="instructions">
      <h3>
        R&D
      </h3>
      <h4>
        R&D is your research and development budget. For every $500 you spend on R&D, your nukes will do an additional 5 points of damage and all your forces will have their speed increase by 1.
      </h4>
    </div>

    <div class="instructions">
      <h3>
        Continents
      </h3>
      <h4>
        North America - Budget: 1000 - HP: 500 - Oceans: AO, PO - Distance: SA=0, AA=3, EU=2, AF=3, AU=4
        South America - Budget: 750 - HP: 750 - Oceans: AO, PO - Distance: NA=0, AA=3, EU=3, AF=2, AU=4
        Asia - Budget: 500 - HP: 1000 - Oceans: IO, PO - Distance: NA=3, SA=3, EU=0, AF=1, AU=1
        Europe - Budget: 1100 - HP: 400 - Oceans: AO - Distance: NA=2, SA=3, AA=0, AF=1, AU=5
        Africa - Budget: 600 - HP: 900 - Oceans: AO, IO - Distance: NA=3, SA=2, AA=1, EU=1, AU=3
        Australia - Budget: 800 - HP: 700 - Oceans: IO, PO - Distance: NA=4, SA=4, AA=1, EU=5, AF=3
      </h4>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Home',
};
</script>


<!-- Added "scoped" attribute to limit CSS to this view only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

.home {
  background-image: url("../assets/blankMap.png");
  background-position: top;
  background-size: cover;
  // background-color:rgba(0, 0, 0, 0.5);
  font-family: $family-mono;
  padding-bottom: 30px;
  margin-bottom: -8px;
}

.instructions {
  width: 55%;
  margin: auto;
  margin-bottom: 40px;
  line-height: 1.8;
}

h1 {
  font-size: 44px;
  padding-top: 120px;
  color: $danger;
  margin-bottom: 60px;
}

h2 {
  font-size: 30px;
  color: $primary;
  margin-bottom: 30px;
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

#app {
  text-align: center;
}
</style>
