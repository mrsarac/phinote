<template>
  <div>
    <div class="app-container container">
      <div class="main">
          <Menu v-bind:class="{ hidden: !isMainListVisible }"></Menu>
          <notes></notes>
        <!--  -->
      </div>
    </div>
  </div>
</template>

<script>
  import Menu from './Menu';
  import Notes from './Notes';

  export default {
    components: { Menu, Notes },
    data() {
      return {
        isMainListVisible: true,
      };
    },
    methods: {
      setMainListVisible() {
        return this.isMainListVisible = !this.isMainListVisible;
      },

    },
  };
</script>

