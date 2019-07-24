<template>

  <div>
    <div class="login-page">
      <div class="left-logo">
        <img src="../../assets/images/login-logo-w.png" class="phinote-login-logo" alt="">
        <div class="stars small"></div>
        <div class="stars medium"></div>
        <div class="stars large"></div>
      </div>
      <div class="login-form">

        <div class="login-form-inner">

          <h2>Sign Up</h2>

          <form class="form-signin" v-if="!messageSuccess" @submit.prevent="signUp">

            <div class="loading signup" v-if="loading">
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>

            <div class="form-group">
              <label for="email">E-Mail</label>
              <input type="email" v-model="mailAddress" class="form-control"  id="email" placeholder="Enter e-mail"
                     autocomplete="off" >
            </div>

            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" v-model="name" class="form-control"  id="name" placeholder="Enter your name"
                     autocomplete="off" >
            </div>

            <div class="form-group">
              <label for="pass">Password</label>
              <input type="password" v-model="password" class="form-control" id="pass" placeholder="Password" autocomplete="off">
            </div>

            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>

          </form>

          <div class="alert success" v-if="messageSuccess">
            <p>{{messageSuccess}}</p>
          </div>

          <div class="alert danger" v-if="message">
            <p>{{message}}</p>
          </div>

          <div class="new-member">
            <p>If you have an account
              <router-link type="href" class="" to="/login" exact>please Login</router-link>
            </p>

          </div>
        </div>
      </div>
    </div>


  </div>


</template>

<script>

  import axios from 'axios';

  export default {
    name: 'SignUp',
    data() {
      return {
        bgImg: this.bg(),
        message: null,
        messageSuccess: null,
        name: null,
        password: null,
        mailAddress: null,
        loading: false,
      };
    },
    created() {

    },
    computed: {

    },
    methods: {
      signUp() {
        const url = `${this.$serverURL}/api/users/save`;

        const data = {
          name: this.name,
          password: this.password,
          mailAddress: this.mailAddress,
        };

        this.loading = true;

        axios.post(url, data)
          .then(response => this.signUpSuccessfull(response))
          .catch(error => this.signUpFailed(error));
      },

      signUpSuccessfull() {
        this.loading = false;

        this.messageSuccess = "Thanks for Sign up. It's completed, Please check your mail. Now you are redirected to login page";

        setTimeout(() => {
          this.$router.push(this.$route.query.redirect || '/login');
        }, 10000);
      },

      signUpFailed(error) {
        this.loading = false;
        this.message = `${error.message} Error: Please check your information: ${error.response.data.message}`;
      },

      bg() {
        const rnm = Math.floor(Math.random() * 4) + 1;
        const b = `url("/static/images/login-bg-${rnm}.png")`;
        return b;
      },

    },
  };

</script>

<style lang="scss">



</style>
