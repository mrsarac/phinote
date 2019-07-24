<template>

  <div class="main-left">
    <div class="main-left-header">
      <ul class="main-links">
        <li>
          <router-link type="href" to="/main" exact active-class="active" ><span class="icon icon-stack"></span> All Notes</router-link>
        </li>
        <li>
          <a href="#" @click="isTagActive" > <span class="icon icon-cloud"></span> Tags <small style="display: none">(tagscount)</small></a>
        </li>

        <!--
            <li>
              <router-link type="href" to="/profile" exact>
                <span class="icon icon-user"></span> Profile
              </router-link>
            </li>

            <li>
              <router-link type="href" to="/map" exact><span class="icon icon-globe"></span> Map</router-link>
            </li>
            <li>
              <router-link type="href" to="/weather" exact><span class="icon icon-cloud"></span> Weather</router-link>
            </li>
             -->
      </ul>
    </div>

    <div class="main-left-content">

      <ul class="main-tags-sub" v-if="tagList">
        <li  v-for="tag in $root.allTags">
          <router-link v-if="tag.noteListSize>0" type="href" :to="`/tags/${tag.id}/${tag.name}`" exact>{{tag.name}}<small>({{tag.noteListSize}})</small></router-link>
          <a href="#" v-if="tag.noteListSize==0">{{tag.name}}<small>({{tag.noteListSize}})</small></a>
          <!-- <span class="tag-delete" @click="deleteTag(tag.id)">Delete</span> -->
        </li>
      </ul>
    </div>
    <div class="main-left-footer">
      <router-link type="href"  class="fl trash" title="Trashcan" to="/trash" exact active-class="active"><i class="icon icon-trash"></i>  Trash</router-link>
      <a href="#logout" class="fr logout"  title="Log out" @click="logOut"><i class="icon icon-logout"></i></a>
      <a href="#login" class="fr logout"  title="Login" @click="login"><i class="icon icon-cloud"></i></a>
      <!-- <a href="#settings" class="fr settings" title="Settings"><i class="icon icon-settings"></i></a> -->
    </div>
  </div>

</template>
<script>

  import allTags from '../mixins/allTags';

  export default {
    name: 'Menu',
    mixins: [allTags],
    data() {
      return {
        tagList: true,
      };
    },

    created() {
      this.getAllTags()
    },

    methods: {

      logOut() {
        // localStorage.clear();
        localStorage.removeItem('token');
        this.$router.push(this.$route.query.redirect || '/logout');
      },

      login() {

      },
    /*
    // Socketi koparticagiz...
      disconnect() {
        if (stompClient !== null) {
          stompClient.disconnect();
        }
        setConnected(false);
        console.log("Disconnected");
      },

      */

      isTagActive: function(){
        // this.tagList = !this.tagList;
      },


    },
  };

</script>
<style lang="scss">

</style>
