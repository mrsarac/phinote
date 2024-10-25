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

<script lang="ts">
import { defineComponent, ref, onBeforeRouteUpdate } from 'vue';
import Menu from "./Menu";
import Notes from "./Notes";

export default defineComponent({
  components: { Menu, Notes },
  setup() {
    const selectedTagId = ref<number | null>(null);
    const selectedTagName = ref<string | null>(null);

    onBeforeRouteUpdate((to, from, next) => {
      selectedTagId.value = to.params.id;
      selectedTagName.value = to.params.name;
      next();
    });

    return {
      selectedTagId,
      selectedTagName
    };
  },
  created() {
    this.selectedTagId = this.$route.params.id;
    this.selectedTagName = this.$route.params.name;
  }
});
</script>
