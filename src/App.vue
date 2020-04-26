<template>
  <div id="app">
    <CelesteCalendar />
  </div>
</template>

<script>
import CelesteCalendar from './components/CelesteCalendar.vue'

export default {
  name: 'App',
  components: {
    CelesteCalendar
  }
}
</script>

<style>
body {
  background-color: #FAC2B8;
  font-family: Verdana, sans-serif; 
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>