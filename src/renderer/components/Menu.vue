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
      </ul>
    </div>
    <div class="main-left-content">
      <ul class="main-tags-sub" v-if="tagList">
        <li v-for="tag in $root.allTags">
          <router-link v-if="tag.noteListSize>0" type="href" :to="`/tags/${tag.id}/${tag.name}`" exact>{{tag.name}}<small>({{tag.noteListSize}})</small></router-link>
          <a href="#" v-if="tag.noteListSize==0">{{tag.name}}<small>({{tag.noteListSize}})</small></a>
        </li>
      </ul>
    </div>
    <div class="main-left-footer">
      <router-link type="href" class="fl trash" title="Trashcan" to="/trash" exact active-class="active"><i class="icon icon-trash"></i> Trash</router-link>
      <a href="#logout" class="fr logout" title="Log out" @click="logOut"><i class="icon icon-logout"></i></a>
      <a href="#login" class="fr logout" title="Login" @click="login"><i class="icon icon-cloud"></i></a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import allTags from '../mixins/allTags';

export default defineComponent({
  name: 'Menu',
  mixins: [allTags],
  setup() {
    const tagList = ref(true);

    const logOut = () => {
      localStorage.removeItem('token');
      this.$router.push(this.$route.query.redirect || '/logout');
    };

    const login = () => {
      // Implement login functionality here
    };

    const isTagActive = () => {
      // Implement tag active functionality here
    };

    onMounted(() => {
      this.getAllTags();
    });

    return {
      tagList,
      logOut,
      login,
      isTagActive
    };
  }
});
</script>

<style lang="scss">
</style>
