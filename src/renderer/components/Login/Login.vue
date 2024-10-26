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

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Login',
  setup() {
    const message = ref<string | null>(null);
    const remember = ref<boolean | null>(null);
    const mailAddress = ref<string>('');
    const password = ref<string>('');

    const login = async () => {
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
        mailAddress: mailAddress.value,
        password: password.value,
      };

      const url = `${import.meta.env.VITE_SERVER_URL}/api/login`;

      try {
        const response = await axios.post(url, data, config);
        loginSuccessful(response);
      } catch (error) {
        loginFailed(error);
      }
    };

    const loginSuccessful = (response: any) => {
      const token = response.data.data;
      localStorage.setItem('token', JSON.stringify(token));

      if (remember.value) {
        setRememberMe(mailAddress.value, password.value);
      } else {
        removeRememberMe();
      }

      this.$router.push(this.$route.query.redirect || '/main');
    };

    const loginFailed = (error: any) => {
      message.value = `${error.message} Error: Please check your information: ${error.response.data.message}`;
    };

    const setRememberMe = (mailAddress: string, password: string) => {
      const rememberData = {
        mailAddress: mailAddress,
        password: password
      };
      localStorage.setItem('remember', JSON.stringify(rememberData));
    };

    const isRememberMe = () => {
      const rememberData = JSON.parse(localStorage.getItem('remember') || 'null');
      if (rememberData) {
        remember.value = true;
        mailAddress.value = rememberData.mailAddress;
        password.value = rememberData.password;
        if (this.$route.path !== "/logout") {
          login();
        }
      }
    };

    const removeRememberMe = () => {
      localStorage.removeItem('remember');
    };

    onMounted(() => {
      isRememberMe();
    });

    return {
      message,
      remember,
      mailAddress,
      password,
      login
    };
  }
});
</script>

<style lang="scss">



</style>
