import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/administrator',
    alwaysShow: true, // will always show the root menu
    name: 'Setting',
    meta: {
      title: '系统设置',
      icon: 'setting'
    },
    children: [
      {
        path: 'administrator',
        component: () => import('@/views/setting/administrator'),
        name: 'Administrator',
        meta: { title: '管理员列表', icon: 'user' }
      },
      {
        path: 'role',
        component: () => import('@/views/setting/role'),
        name: 'Role',
        meta: { title: '角色列表', icon: 'role' }
      },
      {
        path: 'permission',
        component: () => import('@/views/setting/permission'),
        name: 'Permission',
        meta: { title: '权限列表', icon: 'lock' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'User',
        meta: { title: '用户列表', icon: 'user' }
      }
    ]
  },
  {
    path: '/dialect',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/dialect/index'),
        name: 'Question',
        meta: { title: '方言列表', icon: 'speak' }
      }
    ]
  },
  {
    path: '/question',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/question/index'),
        name: 'Question',
        meta: { title: '题目列表', icon: 'question' }
      }
    ]
  },
  {
    path: '/feedback',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/feedback/index'),
        name: 'Feedback',
        meta: { title: '反馈列表', icon: 'feedback' }
      }
    ]
  },
  {
    path: '/certificate',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/certificate/index'),
        name: 'Certificate',
        meta: { title: '证书列表', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/district',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/district/index'),
        name: 'District',
        meta: { title: '地区列表', icon: 'district' }
      },
      {
        path: 'detail',
        component: () => import('@/views/district/detail'),
        name: 'District Detail',
        meta: { title: '地区列表' },
        hidden: true
      }
    ]
  },

  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/list',
    alwaysShow: true, // will always show the root menu
    name: 'Activity',
    meta: {
      title: '活动管理',
      icon: 'component'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/activity/list'),
        name: 'Activity',
        meta: { title: '活动列表', icon: 'list' }
      },
      {
        path: 'create',
        component: () => import('@/views/activity/create'),
        name: 'Activity Create',
        meta: { title: '创建活动', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/activity/edit'),
        name: 'Activity Edit',
        meta: { title: '修改活动', noCache: true, activeMenu: '/activity/list' },
        hidden: true
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
