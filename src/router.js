import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//路由的懒加载
// 1.安装开发依赖'@babel/plugin-syntax-dynamic-import'
// 2.在babel.config.js中声明：'@babel/plugin-syntax-dynamic-import'
// 3.将import Login from './components/Login.vue'改造成下方格式：
// 4.const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')

// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

// import Users from './components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "Users" */ './components/user/Users.vue')
// import Rights from './components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_rights_roles" */ './components/power/Rights.vue')
// import Roles from './components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Users_rights_roles" */ './components/power/Roles.vue')

// import Cates from './components/goods/Cates.vue'
const Cates = () => import(/* webpackChunkName: "cates_lists_GoodsParams" */ './components/goods/Cates.vue')
// import GoodsParams from './components/goods/GoodsParams.vue'
const GoodsParams = () => import(/* webpackChunkName: "cates_lists_GoodsParams" */ './components/goods/GoodsParams.vue')
// import Lists from './components/goods/Lists.vue'
const Lists = () => import(/* webpackChunkName: "cates_lists_GoodsParams" */ './components/goods/Lists.vue')

// import AddGoods from './components/goods/AddGoods.vue'
const AddGoods = () => import(/* webpackChunkName: "addgoods_editgoods" */ './components/goods/AddGoods.vue')
// import EditGoods from './components/goods/EditGoods.vue'
const EditGoods = () => import(/* webpackChunkName: "addgoods_editgoods" */ './components/goods/EditGoods.vue')

// import Orders from './components/order/Orders.vue'
const Orders = () => import(/* webpackChunkName: "orders_reports" */ './components/order/Orders.vue')
// import Reports from './components/report/Reports.vue'
const Reports = () => import(/* webpackChunkName: "orders_reports" */ './components/report/Reports.vue')

//创建VueRouter对象实例
const router = new VueRouter({
    routes: [ 
        { path: '/', redirect: '/login' }, //项目入口路由到login地址
        { path: '/login', component: Login }, //登陆组件
        {
            path: '/home', component: Home, //home组件
            children: [
                {path:'/home',redirect:'/welcome'}, //home入口路由到welcome地址
                {path: '/welcome', component: Welcome }, //welcome组件
                {path:'/users',component:Users},
                {path:'/rights',component:Rights},
                {path:'/roles',component:Roles},
                {path:'/reports',component:Reports},
                {path:'/categories',component:Cates},
                {path:'/goods',component:Lists},
                {path:'/goods/add',component:AddGoods},
                {path:'/goods/edit/:id',component:EditGoods},
                {path:'/params',component:GoodsParams},
                {path:'/orders',component:Orders}
            ]
        }
    ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    //     next()  放行    next('/login')  强制跳转
    if (to.path === '/login') return next()
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})


export default router