// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

/*引入fastclick，应用于整个页面*/
import fastclick from 'fastclick'
fastclick.attach(document.body);

/*引入lib-flexible*/
import 'lib-flexible'

Vue.config.productionTip = false

import './assets/scss/index.scss'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
