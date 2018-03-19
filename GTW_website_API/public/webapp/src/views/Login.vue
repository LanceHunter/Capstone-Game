<template>
  <div class="login">
    <router-view></router-view>
    <h1>Login</h1>
    <button type="button" v-on:click="loginToggle">Login toggle</button>

    <div class="message-body">
      <div class="is-small has-text-danger" v-if="repeate">
        <p>Invalid credentials, try again</p>
      </div>
      <form v-on:submit.prevent="tryLogin(username, password)">
        <div class="field top">
          <p class="control is-small has-icons-left">
            <input class="input is-small" type="text" v-model="username" placeholder="Player Name">
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </p>
        </div>
        <div class="field">
          <p class="control has-icons-left">
            <input class="input is-small" type="password" v-model="password" placeholder="Password">
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
          </p>
        </div>
        <div class="field bottom">
          <p class="control">
            <button type="submit" class="button is-small is-danger">Login</button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import auth from '../common/auth.service';

export default {
  name: 'Login',
  data() {
    return {
      username: null,
      password: null,
      repeate: false,
    };
  },
  methods: {
    loginToggle() {
      console.log('was logged in:', auth.isLoggedIn()); // eslint-disable-line
      if (!auth.isLoggedIn()) {
        auth.login('test0', 'password')
          .then(() => {
            console.log('now logged in:', auth.isLoggedIn()); // eslint-disable-line
          });
      } else {
        auth.logout();
        console.log('now logged in:', auth.isLoggedIn()); // eslint-disable-line
      }
    },
    tryLogin(username, password) {
      auth.login(username, password)
        .then((response) => {
          console.log('succeded with:', response); // eslint-disable-line
          this.$router.push({ name: 'Home' });
        })
        .catch((error) => {
          console.log('failed with:', error); // eslint-disable-line
          this.repeate = true;
        });
    },
  },
};

</script>


<!-- Added "scoped" attribute to limit CSS to this view only -->
<style lang="scss" scoped>
@import "../assets/main.sass";

.login {
  background-image: url("../assets/blankMap.png");
  background-position: top;
  background-size: cover;
  // background-color:rgba(0, 0, 0, 0.5);
  font-family: $family-mono;
  height: 900px;
  margin-bottom: -8px;
}

.message-body {
  margin: auto;
  width: 40%;
  background-color:rgba(0, 0, 0, 0.8);
}

.icon {
  margin-top: 2px;
}

.field {
  margin: auto;
  width: 70%;
}

.input.is-small {
  background-color: white;
}

.control {
  text-align: center;
}

.button.is-small {
  background-color: $primary;
}

.top {
  margin-top: 40px;
}

.bottom {
  margin-bottom: 40px;
}

h1 {
  padding: 220px 0px 40px 0px;
  font-size: 40px;
  font-family: $family-mono;
  color: $danger;
}

#app {
  text-align: center;
}
</style>
