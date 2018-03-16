<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-burger" data-target="navMenu">
        <span>Login</span>
        <span>Home</span>
        <span>Leaderboard</span>
      </div>

      <div class="navbar-menu" id="navMenu">
        <div class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" href="/login">
              Login
            </a>
            <a class="navbar-item" href="/home">
              Home
            </a>
            <a class="navbar-item" href="/leaderboard">
              Leaderboard
            </a>
          </div>

          <div class="navbar-end">

          </div>
        </div>
      </div>

    </div>
  </nav>
</template>


<script>
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
};
</script>


<!-- Added "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

.thenavbar [data-v-c7fd0e9a] {
  font-size: 24px;
  font-family: $family-mono;
  background-color: $background;
  color: $danger;
  // margin-bottom: 100px;
}

a {
  margin-right: 50px;
}

h1, h2 {
  font-weight: normal;
  background-color: $background;
  color: $danger;
}
</style>
