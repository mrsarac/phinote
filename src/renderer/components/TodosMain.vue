<template>
  <div>
    <div class="app-container container">
      <div class="main">
        <Menu></Menu>
        <Todos></Todos>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Menu from "./Menu";
import Todos from "./Todos";

export default defineComponent({
  components: { Menu, Todos },
});
</script>
