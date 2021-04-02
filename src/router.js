import {createRouter, createWebHashHistory} from 'vue-router';

const routes = [{
  name: 'notFound',
  path: '/:path(.*)+',
  redirect: {
    name: '404'
  }
}, {
  name: 'homepage',
  path: '/',
  redirect: {
    name: 'list'
  }
}, {
  name: 'login',
  path: '/login',
  component: () => import('./view/login'),
  meta: {
    title: '登录'
  }
}, {
  name: 'register',
  path: '/register',
  component: () => import('./view/register'),
  meta: {
    title: '注册'
  }
}, {
  name: 'admin',
  path: '/admin',
  component: () => import('./view/admin'),
  meta: {
    needAuth: true,
    title: '审核活动'
  }
}, {
  name: 'list',
  path: '/activityList',
  component: () => import('./view/activity'),
  meta: {
    title: '活动列表'
  }
}, {
  name: 'publish',
  path: '/publish',
  component: () => import('./view/publish'),
  meta: {
    needAuth: true,
    title: '发布活动'
  }
}, {
  name: 'modifyAvatarEmail',
  path: '/modifyAvatarEmail',
  component: () => import('./view/userinfo/modify-avatar-email'),
  meta: {
    needAuth: true,
    title: '修改头像/邮箱'
  }
}, {
  name: 'userinfo',
  path: '/userinfo',
  component: () => import('./view/userinfo'),
  meta: {
    needAuth: true,
    title: '我的'
  },
}, {
  name: 'modifyInfo',
  path: '/modifyInfo',
  component: () => import('./view/userinfo/modify-info'),
  meta: {
    needAuth: true,
    title: '修改个人信息'
  }
}, {
  name: 'modifyPass',
  path: '/modifyPass',
  component: () => import('./view/userinfo/modify-pass'),
  meta: {
    needAuth: true,
    title: '修改密码'
  }
}, {
  name: 'myPublish',
  path: '/myPublish',
  component: () => import('./view/userinfo/my-publish'),
  meta: {
    needAuth: true,
    title: '我发布的活动'
  }
}, {
  name: 'signedUp',
  path: '/signedUp',
  component: () => import('./view/userinfo/signed-up-activity'),
  meta: {
    needAuth: true,
    title: '已报名的活动'
  }
}, {
  name: '404',
  path: '/404',
  component: () => import('./view/404'),
  meta: {
    title: '找不到页面'
  }
}, {
  name: 'forgetPass',
  path: '/forgetPass',
  component: () => import('./view/forget-pass'),
  meta: {
    title: '忘记密码'
  }
}];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  const needAuth = to.meta.needAuth;
  const token = localStorage.getItem('token');
  // console.log('to:', to, ', from:', from, 'needLogin:', needAuth, 'token:', token);
  if (title) {
    document.title = title;
  }
  if (needAuth && !token) {
    next('login')
  } else {
    next();
  }
});

export {router};