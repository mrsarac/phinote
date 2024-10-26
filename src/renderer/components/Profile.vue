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
                <input type="text" v-model="name" class="form-control" id="name" placeholder="Enter your name" autocomplete="off">
              </div>
              <div class="form-group">
                <label for="oldpass">Password</label>
                <input type="password" v-model="oldPassword" class="form-control" id="oldpass" placeholder="Old Password" autocomplete="off">
              </div>
              <div class="form-group">
                <label for="newpass">New Password</label>
                <input type="password" v-model="newPassword" class="form-control" id="newpass" placeholder="New Password" autocomplete="off">
              </div>
              <div class="form-group">
                <label for="newpass2">New Password</label>
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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Menu from './Menu';
import axios from 'axios';

export default defineComponent({
  components: { Menu },
  setup() {
    const loading = ref(false);
    const name = ref('');
    const oldPassword = ref('');
    const newPassword = ref('');
    const newPassword2 = ref('');
    const message = ref<string | null>(null);
    const messageSuccess = ref<string | null>(null);

    const updateUser = async () => {
      console.log(name.value, oldPassword.value, newPassword.value, newPassword2.value);

      const url = `${import.meta.env.VITE_SERVER_URL}/api/users/save`;

      if (newPassword.value.length < 6) {
        message.value = "Your new password will be min 6 characters";
      } else {
        if (newPassword.value === newPassword2.value) {
          messageSuccess.value = "Passwords match";
          message.value = null;
          loading.value = true;

          const data = {
            name: name.value,
            password: oldPassword.value,
            newPassword: newPassword.value,
          };

          try {
            const response = await axios.post(url, data);
            updateSuccessful(response);
          } catch (error) {
            updateFailed(error);
          }
        } else {
          message.value = "Passwords do not match";
          messageSuccess.value = null;
        }
      }
    };

    const updateSuccessful = (response: any) => {
      loading.value = false;
      console.log("Update successful!");
    };

    const updateFailed = (error: any) => {
      loading.value = false;
      message.value = `${error.message} Error: Please check your information: ${error.response.data.message}`;
    };

    return {
      loading,
      name,
      oldPassword,
      newPassword,
      newPassword2,
      message,
      messageSuccess,
      updateUser
    };
  }
});
</script>

<style lang="scss" scoped>
</style>
