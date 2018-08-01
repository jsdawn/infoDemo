import Vue from 'vue'
import App from '@/App'
import axios from 'axios'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import VueLazyLoad from 'vue-lazyload'
import '@/vCharts'                            // api: https://v-charts.js.org


Vue.prototype.$axios = axios
Vue.use(VueCookie)
Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  error: require('./assets/img/loading404.png'),
  loading: require('./assets/img/loading.gif')
})

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
