import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/welcome'
    },
    {
      path: '/',
      component: resolve => require(['@/views/home.vue'], resolve),
      meta: { title: "模板" },
      children: [
        {
          path: '/welcome',
          component: resolve => require(['@/views/Welcome.vue'], resolve),
          meta: { title: "系统首页" }
        },
        {
          path: '/controller',
          component: resolve => require(['@/views/Controller/Controller.vue'], resolve),
          meta: { title: "管理员列表" }
        },
        {
          path: '/department',
          component: resolve => require(['@/views/department/department.vue'], resolve),
          meta: { title: "部门列表" }
        },
        {
          path: '/order',
          component: resolve => require(['@/views/order/order.vue'], resolve),
          meta: { title: "订单列表" }
        },
        {
          path: '/permission',
          component: resolve => require(['@/views/permission/permission.vue'], resolve),
          meta: { title: "权限列表" }
        },
        {
          path: '/role',
          component: resolve => require(['@/views/role/role.vue'], resolve),
          meta: { title: "角色列表" }
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['@/views/login.vue'], resolve),
      meta: { title: "登录" }
    },
  ]
})
