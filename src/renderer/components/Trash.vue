<template>
  <div>
    <div class="app-container container">
      <div class="main">
        <Menu></Menu>
        <Notes></Notes>
      </div>
    </div>
  </div>
</template>

<script>
  import Menu from "./Menu";
  import Notes from "./Notes";

  export default {
    components: {Menu, Notes},
  }
</script>

