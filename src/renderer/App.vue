<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'phinote'
  }
</script>

<style lang="scss">
  @import '/assets/sass/reset.scss';
  @import '/assets/sass/styles.scss';
  @import '/assets/sass/loading.scss';
  @import '/assets/sass/login.scss';
  @import '/assets/sass/global.scss';
  @import '/assets/sass/main-left.scss';
  @import '/assets/sass/note.scss';
  @import '/assets/sass/note-list.scss';
  @import '/assets/sass/todo-list.scss';
  @import '/assets/sass/search.scss';
  @import '/assets/sass/settings.scss';
</style>
