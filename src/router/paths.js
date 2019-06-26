export default [

  {
    path: '*',
    meta: {
      public: true,
    },
    redirect: {
      path: '/404'
    }
  },
  {
    path: '/404',
    meta: {
      public: true,
    },
    name: 'NotFound',
    component: () => import(`@/views/NotFound.vue`)
  },
  {
    path: '/403',
    meta: {
      public: true,
    },
    name: 'AccessDenied',
    component: () => import(
      /* webpackChunkName: "routes" */
      `@/views/Deny.vue`
    )
  },
  {
    path: '/500',
    meta: {
      public: true,
    },
    name: 'ServerError',
    component: () => import(
      /* webpackChunkName: "routes" */
      `@/views/Error.vue`
    )
  },
  {
    path: '/login',
    meta: {
      public: true,
    },
    name: 'Login',
    component: () => import(
      /* webpackChunkName: "routes" */
      `@/views/Login.vue`
    )
  },
  {
    path: '/',
    meta: { },
    name: 'Root',
    redirect: {
      name: 'Dashboard'
    }
  },
  {
    path: '/dashboard',
    meta: { breadcrumb: true },
    name: 'Dashboard',
    component: () => import(
      /* webpackChunkName: "routes" */
      `@/views/Dashboard.vue`
    )
  },

  {
      path: '/workflow/workflow',
      meta: { breadcrumb: true },
      name: 'Workflow',
      component: () => import(
          /* webpackChunkName: "routes" */
          `@/views/workflow/Workflow.vue`
          )
  },
  {
      path: '/workflow/jobs',
      meta: { breadcrumb: true },
      name: 'Jobs',
      component: () => import(
          /* webpackChunkName: "routes" */
          `@/views/workflow/Job.vue`
          )
  },
  {
      path: '/workflow/flow-tasks',
      meta: { breadcrumb: true },
      name: 'FlowTask',
      component: () => import(
          /* webpackChunkName: "routes" */
          `@/views/workflow/FlowTask.vue`
          )
  },
    {
        path: '/workflow/flow-editor',
        meta: { breadcrumb: true },
        name: 'FlowEditor',
        component: () => import(
            `@/views/workflow/FlowEditor.vue`
            )
    },
    {
        path: '/workflow/tasks',
        meta: { breadcrumb: true },
        name: 'Tasks',
        component: () => import(`@/views/workflow/Tasks.vue`)
    },
    {
        path: '/workflow/task/log',
        meta: { breadcrumb: true },
        name: 'TaskLog',
        component: () => import(`@/views/workflow/TaskLog.vue`)
    },
    {
        path: '/manager/handlers',
        meta: { breadcrumb: true },
        name: 'Handlers',
        component: () => import(`@/views/handler/Handlers.vue`)
    },
    {
        path: '/manager/users',
        meta: { breadcrumb: true },
        name: 'Users',
        component: () => import(`@/views/users/Users.vue`)
    },
];
