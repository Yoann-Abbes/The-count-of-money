import Vue from 'vue'
import App from './App.vue'
import router from './core/router'
import store from './core/store'
import vuetify from './core/plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'
import FBSignInButton from 'vue-facebook-signin-button'
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.use(FBSignInButton)
Vue.component('apexchart', VueApexCharts)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
