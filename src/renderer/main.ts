import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

if (!process.env.IS_WEB) {
  const VueElectron = require('vue-electron');
  createApp(App).use(VueElectron);
}

const app = createApp(App);
app.config.globalProperties.$http = axios;
app.config.globalProperties.$serverURL = 'http://sv1.phinote.com:8080';
app.use(router);
app.use(store);
app.mount('#app');

interface LoginControl {
  created(): void;
  methods: {
    welcome(): void;
  };
}

const loginControl: LoginControl = {
  created() {
    this.welcome();
  },
  methods: {
    welcome() {
      if (localStorage.getItem('token')) {
        this.$router.push(this.$route.query.redirect || '/main');
      } else {
        if (this.$route.name !== 'SignUp') {
          this.$router.push(this.$route.query.redirect || '/login');
        }
      }
    },
  },
};

app.mixin(loginControl);

app.config.globalProperties.allTags = {};
