import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$serverURL = 'http://sv1.phinote.com:8080'



const loginControl = {
    created() {
        this.welcome()
    },
    methods: {
        welcome() {
            if (localStorage.getItem('token')) {
                // console.log("local de token var: ", localStorage.getItem('token') );
                this.$router.push(this.$route.query.redirect || '/main');
            } else {
                if(this.$route.name != 'SignUp') {
                    this.$router.push(this.$route.query.redirect || '/login');
                }
            }
        },
    },
}


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
    mixins: [loginControl],
    data(){
      return {
        allTags: {}
      }
    },
}).$mount('#app')
