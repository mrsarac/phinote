<template>

  <div class="main">
    <div class="login-page">
      <div class="left-logo">
        <img src="../../assets/images/login-logo-w.png" class="phinote-login-logo" alt="">
        <div class="stars small"></div>
        <div class="stars medium"></div>
        <div class="stars large"></div>
      </div>
      <div class="login-form">

        <div class="login-form-inner">

          <h2>Login</h2>

          <form class="form-signin" @submit.prevent="login">
            <div class="form-group">
              <label for="mailAddress">E-Mail</label>
              <input type="text" v-model="mailAddress" class="form-control"  id="mailAddress" aria-describedby="emailHelp" placeholder="Enter mail"
                     autocomplete="off" >
            </div>
            <div class="form-group">
              <label for="pass">Password</label>
              <input type="password" v-model="password" class="form-control" id="pass" placeholder="Password" autocomplete="off">
            </div>

            <div class="form-group remember">
              <input type="checkbox" id="remember" name="remember" v-model="remember">
              <label for="remember">Remember me</label>
            </div>

            <button class="btn" type="submit">Sign in</button>

            <div class="alert danger" v-if="message">
              <p>{{message}}</p>
            </div>

          </form>

          <div class="new-member">
            <p>Not a member?
              <router-link type="href" class="" to="/signup" exact>Sign up now</router-link>
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
    name: 'Login',
    data() {
      return {
        message: null,
        remember: null,
        mailAddress: '',
        password: '',
      };
    },
    created() {

      this.isRememberMe();


      // localStorage.setItem('token', JSON.stringify(this.$token));
      // console.log("local storage: ", JSON.parse(localStorage.getItem('token')) );

    },
    computed: {

    },

    methods: {

      login() {
        const config = {
          headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Access-Control-Allow-Origin': '*'
          },

          method: 'POST',
          credentials: 'include',
          cache: 'no-cache',
        };

        const data = {
          mailAddress: this.mailAddress,
          password: this.password,
        };

        const url = `${this.$serverURL}/api/login`;

        axios.post(url, data, config)
          .then(response => this.loginSuccessful(response))
          .catch(error => this.loginFailed(error));
      },

      loginSuccessful(response) {
        // Local storage a token'ı yaz.

          console.log("Girdi")

        const token = response.data.data;

        localStorage.setItem('token', JSON.stringify(token));

        // console.log("local storage: ", JSON.parse(localStorage.getItem('token')) );

        if(this.remember) {
          // Remember me is selected
          this.setRememberMe(this.mailAddress, this.password)
        } else {
          // Remember me is not selected
          this.removeRememberMe()
        }

        // Adrese yonlendir
          this.$router.push(this.$route.query.redirect || '/main');
      },
      loginFailed(error) {
        console.log("Failed");
        this.message = `${error.message} Error: Please check your information: ${error.response.data.message}`;

      },

      setRememberMe(mailAddress,password){

        let remember = {
          mailAddress: mailAddress,
          password: password
        }

        localStorage.setItem('remember', JSON.stringify(remember));

      },

      isRememberMe(){
        let remember = JSON.parse(localStorage.getItem('remember'));

        if(remember != null) {

          console.log("store dolu, formu doldur")
          this.remember = true;
          this.mailAddress = remember.mailAddress;
          this.password = remember.password;

          // done otomatik olarak bağlan

          if (this.$route.path != "/logout") {
            this.login();
          }


        } else {
          console.log("store boş1, bir şey yapma")
        }

      },

      removeRememberMe() {
        console.log("Local sotreda remember silindi")
        localStorage.removeItem('remember');
      }



    },
  };

</script>

<style lang="scss">



</style>
