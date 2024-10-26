<template>
  <div>
    <div class="app-container container">
      <div class="main">
        <Menu></Menu>
        <SocketTestDetail></SocketTestDetail>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Menu from "./Menu";
import SocketTestDetail from "./SocketTestDetail";

export default defineComponent({
  components: { Menu, SocketTestDetail },
});
</script>
