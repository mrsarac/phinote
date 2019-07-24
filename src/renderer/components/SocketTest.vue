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

<script>
  import Menu from "./Menu";
  import SocketTestDetail from "./SocketTestDetail";

  export default {
    components: {Menu, SocketTestDetail},
  }
</script>

