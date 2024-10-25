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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Menu from './Menu';
import Notes from './Notes';

export default defineComponent({
  components: { Menu, Notes },
  setup() {
    const isMainListVisible = ref(true);

    const setMainListVisible = () => {
      isMainListVisible.value = !isMainListVisible.value;
    };

    return {
      isMainListVisible,
      setMainListVisible
    };
  }
});
</script>
