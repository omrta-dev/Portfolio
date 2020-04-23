<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/moon.svg">
    <CelesteCalendar v-bind:month=3 />
    <InfoBar />
  </div>
</template>

<script>
import CelesteCalendar from './components/CelesteCalendar.vue'
import InfoBar from './components/InfoBar.vue'

export default {
  name: 'App',
  components: {
    CelesteCalendar,
    InfoBar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>