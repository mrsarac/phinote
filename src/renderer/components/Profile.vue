<template>

  <div>

    <div class="app-container container">

      <div class="main">
        <div class="main-left">
          <Menu></Menu>
        </div>

        <div class="r">
          <div class="inner-page">
          <h2>Profile</h2>

            <form class="form-update" @submit.prevent="updateUser">

              <div class="loading signup" v-if="loading">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
              </div>

              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" v-model="name" class="form-control"  id="name" placeholder="Enter your name"
                       autocomplete="off" >
              </div>

              <div class="form-group">
                <label for="oldpass">Password</label>
                <input type="password" v-model="oldPassword" class="form-control" id="oldpass" placeholder="Old Password" autocomplete="off">
              </div>

              <div class="form-group">
                <label for="newpass">New Password</label>
                <input type="password" v-model="newPassword"  class="form-control" id="newpass" placeholder="New Password" autocomplete="off">
              </div>

              <div class="form-group">
                <label for="newpass">New Password</label>
                <input type="password" v-model="newPassword2" class="form-control" id="newpass2" placeholder="New Password" autocomplete="off">
              </div>

              <button class="btn btn-lg btn-primary btn-block" type="submit">Update</button>

              <div class="alert success" v-if="messageSuccess">
                <p>{{messageSuccess}}</p>
              </div>

              <div class="alert danger" v-if="message">
                <p>{{message}}</p>
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import Menu from "./Menu";
  import axios from 'axios';

  export default {
    components: {Menu},

    data() {
      return {
        loading: false,
        name: "",
        oldPassword: "",
        newPassword: "",
        newPassword2: "",
        message: null,
        messageSuccess: null,
      }
    },

    created() {

    },
    methods: {

      updateUser() {

        console.log(
          this.name,
          this.oldPassword,
          this.newPassword,
          this.newPassword2,
        );

        let url = this.$serverURL +'/api/users/save';

        console.log(this.newPassword.length);



        if(this.newPassword.length < 6) {
          this.message = "Your new password will be min 6 character";
        } else {
          if(this.newPassword == this.newPassword2 ) {
            this.messageSuccess = "Şifreler uyuşuyor";
            this.message = null;
            this.loading = true;

           let data = {
              name: this.name,
              password: this.oldPassword,
              newPassword: this.newPassword,
            }

            axios.post(url, data)
              .then(response => this.updateSuccessful(response))
              .catch(error => this.updateFailed(error))

          } else {
            this.message = "Passwords does note same";
            this.messageSuccess = null;
          }
        }

      },

      updateSuccessful(response){
        this.loading = false;
        console.log("Update oldu!")
      },

      updateFailed(error){
        this.loading = false;
        this.message = error.message +  " Error: Please check your information: " + error.response.data.message;
      },


    }
  }

</script>

<style lang="scss" scoped>


</style>
