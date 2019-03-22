<template>
  <div id="app" class="full-center">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
#app {
  display: flex;
}

.full-center {
  display: flex; 
  justify-content: center; 
  align-content: center;
}
</style>