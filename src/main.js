import Vue from 'vue'
import App from './App.vue'
import VuePictureSwipe from 'vue-picture-swipe';
Vue.component('vue-picture-swipe', VuePictureSwipe);

Vue.config.productionTip = true

new Vue({
  render: h => h(App),
}).$mount('#app')