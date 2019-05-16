import Vue from 'vue';
import Router from 'vue-router';
import paths from './paths';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import axios from 'axios'
import auth from './auth'

Vue.use(Router);
const router =  new Router({
  base: '/',
  mode: 'hash',
  linkActiveClass: 'active',
  routes: paths
});

// 如果token不为空，请求添加token
axios.interceptors.request.use(
    config => {
        config.withCredentials = true;
        let token = auth.getToken();
        if (token) {
            config.headers = {
                'Authorization': token
            }
        }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

//服务端权限校验
axios.interceptors.response.use(
    response => {
        if(response.status === 401) {
            auth.cleanAuth();
            router.replace({
                path: '/login',
            })
        } else {
            return response;
        }

    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    auth.cleanAuth();
                    window.getApp.$emit('APP_AUTH_FAILED');
                    break;
                case 403:
                    window.getApp.$emit('APP_ACCESS_DENIED');

                    /*router.replace({
                        path: '/403',
                    });*/
                    break;
                case 500:
                    router.replace({
                        path: '/500',
                    });
            }
        }
        return Promise.reject(error)
    }
);

// 客户端权限校验
router.beforeEach((to, from, next) => {
    NProgress.start();

    if(to.fullPath === '/login' || auth.checkAuth() ) {
        next();
    } else {
        next({
            path: '/login',
        })
    }
});

router.afterEach((to, from) => {
  NProgress.done();
});

export default router;
