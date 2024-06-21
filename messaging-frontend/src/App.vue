<template>
  <div>
  <div class="bg-white">
    <router-view :key="$route.fullPath" />
  </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="css">
@import url("/src/assets/css/scrollbars.css");
@import url("/src/assets/css/font.css");
html,
body {
  font-family: "Graphik", sans-serif;
  margin: 0px;
  height: 100vh;
  box-sizing: border-box;
  background-color: #FFFFFF;
}


#nprogress .spinner-icon {
  border-top-color: #00AD1B !important;
  border-left-color: #00AD1B !important;
}

#nprogress .bar {
  background: #00AD1B !important;
}

#nprogress .peg {
  box-shadow: 0 0 10px greenyellow, 0 0 5px #00AD1B !important;
}


</style>
