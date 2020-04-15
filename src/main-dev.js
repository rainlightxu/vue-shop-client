import Vue from 'vue'
import App from './App.vue'
// 开发模式下，导入element.js插件
import './plugins/element.js'

import router from './router.js'
// 导入全局样式表
import './assets/css/global.css'
//导入第三方阿里图标库
import './assets/fonts/iconfont.css'
// 导入依赖组件vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
//全局注册组件vue-table-with-tree-grid
Vue.component('tree-table', TreeTable)
//创建全局的时间过滤器
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//导入axios 并配置axios基本访问路径为http://127.0.0.1:8888/api/private/v1/
import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//除了登陆的api，其他的api都是需要授权的api，必须在请求头中添加authorization字段提供的token令牌，才能正常访问api接口。
// 通过axios配置请求拦截器添加token
axios.interceptors.request.use(config => {
  // 在 request 请求拦截器中，展示进度条 NProgress.start()
  NProgress.start()
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// 在 response 响应拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
//导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.config.productionTip = false
// 创建vue对象实例，并使用render渲染成App.vue组件
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
