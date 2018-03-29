<template>
  <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-burger" data-target="navMenu">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div class="navbar-menu" id="navMenu">
        <div class="navbar-start">
          <a class="navbar-item" href="/">
            Home
          </a>
          <a v-if="!username" class="navbar-item" href="/login">
            Login
          </a>
          <a v-if="username" class="navbar-item" href="/launchgame">
            Launch game
          </a>
          <a v-if="username" class="navbar-item" href="/leaderboard">
            Leaderboard
          </a>
          <a v-if="username" class="navbar-item" v-bind:href="'/stats/' + username">
            My stats
          </a>
          <a v-if="username" class="navbar-item" v-on:click="logout" href="/">
            Logout
          </a>
        </div>

        <div class="navbar-end">
        </div>
    </div>

  </nav>
</template>


<script>
import auth from '../common/auth.service';

// Javascript for navbar
document.addEventListener('DOMContentLoaded', function jsnav() { // eslint-disable-line
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function navbur($el) { // eslint-disable-line
      $el.addEventListener('click', function navel() { // eslint-disable-line
        // Get the target from the "data-target" attribute
        const target = $el.dataset.target;
        const $target = document.getElementById(target);
        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});

export default {
  name: 'TheNavbar',
  data() {
    return {
      username: auth.getUser(),
    };
  },
  methods: {
    logout() {
      auth.logout();
    },
  },
  watch: {
    '$route'(to, from) {
      if (to.path === '/') {
        this.username = auth.getUser();
      }
    },
  },
};
</script>

<!-- Added "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

.navbar-menu.is-active {
  background-color: white;
}

.navbar {
  font-size: 20px;
  font-family: $family-mono;
  background-color: $background;
  color: $danger;
  margin-bottom: 20px;
}

a {
  margin-right: 50px;
}

</style>
