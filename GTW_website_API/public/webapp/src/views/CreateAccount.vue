<template>
  <div class="login">
    <router-view></router-view>
    <h1>Create Account</h1>

    <div class="message-body">
      <div class="is-small has-text-danger" v-if="errorMsg">
        <p>{{ errorMsg }}</p>
      </div>
      <form v-on:submit.prevent="tryCreate(username, password, confirmPassword)">
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
        <div class="field">
          <p class="control has-icons-left">
            <input class="input is-small"
                   type="password"
                   v-model="confirmPassword"
                   placeholder="Confirm Password">
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
  name: 'CreateAccount',
  data() {
    return {
      username: null,
      password: null,
      confirmPassword: null,
      errorMsg: null,
    };
  },
  methods: {
    tryCreate(username, password, confirmPassword) {
      if (password !== confirmPassword) {
        this.errorMsg = 'Passwords do not match, try again.';
      } else {
        auth.create(username, password)
          .then((response) => { // eslint-disable-line
            this.$router.push({ name: 'Login' });
          })
          .catch((error) => { // eslint-disable-line
            this.errorMsg = 'Username taken, try again.';
          });
      }
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
