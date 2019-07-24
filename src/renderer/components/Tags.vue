<template>
  <div>
    <div class="app-container container">
      <div class="main">
        <Menu></Menu>
        <Notes :tagId="selectedTagId" :tagName="selectedTagName"></Notes>
      </div>
    </div>
  </div>
</template>

<script>
  import Menu from "./Menu";
  import Notes from "./Notes";

  export default {
    components: {Menu, Notes},

    data() {
      return {
        selectedTagId: null,
        selectedTagName: null,
      };
    },
    created() {
      this.selectedTagId = this.$route.params.id;
      this.selectedTagName = this.$route.params.name;
    },
    beforeRouteUpdate(to, from, next) {
      this.selectedTagId = to.params.id
      this.selectedTagName = to.params.name
      next()
    }

  }
</script>

