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

<script>
  import Menu from "./Menu";
  import Todos from "./Todos";

  export default {
    components: {Menu, Todos},
  }
</script>
