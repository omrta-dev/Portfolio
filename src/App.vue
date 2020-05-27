<template>
<div id='app'>
  <NavBar />
  <CelesteCalendar />
  <Footer />
</div>
</template>

<script>
import CelesteCalendar from './components/CelesteCalendar.vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    CelesteCalendar,
    NavBar,
    Footer
  }
}
</script>
<style lang='scss'>
:root {
  @each $name, $color in $colors {
    @if type-of($color) == "map" {
      @each $variant-name, $variant-color in $color {
        #{$color-prefix}-#{$name}-#{$variant-name}: $variant-color;
      }
    } @else if type-of($color) == "color" {
      #{$color-prefix}-#{$name}: $color;
    }
  }
}

body {
  height: 100vh;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#app .footer {
  flex: 0 1 auto;
}

</style>