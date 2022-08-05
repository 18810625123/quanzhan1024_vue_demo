import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory('./'), // history模式：createWebHistory
    //history: createWebHashHistory(), // hash模式：createWebHashHistory，
    routes: [
        {path: '/404', name: '', component: () => import('../pages/errors/404.vue')},
        // 首页
        {path: '/', redirect: '/blogs'},
        {path: '/home', name: '', component: () => import('../pages/home.vue')},
        // 登录注册
        {path: '/login', name: '', component: () => import('../pages/login.vue')},
        // 用户
        {path: '/users/me', name: '', component: () => import('../pages/users/me.vue')},
        {path: '/users/edit', name: '', component: () => import('../pages/users/edit.vue')},
        {path: '/users/score', name: '', component: () => import('../pages/users/score.vue')},
        {path: '/users/detail/:uid', name: '', component: () => import('../pages/users/detail.vue')},
        {path: '/users/detail/:uid/:share_uid', name: '', component: () => import('../pages/users/detail.vue')},
        {path: '/users/fans_cares/:uid', name: '', component: () => import('../pages/users/fans_cares.vue')},
        {path: '/users/awards', name: '', component: () => import('../pages/users/awards.vue')},
        // 消息
        {path: '/messages', name: '', component: () => import('../pages/messages/index.vue')},
        {path: '/messages/detail', name: '', component: () => import('../pages/messages/detail.vue')},
        // 反馈
        {path: '/suggests/add', name: '', component: () => import('../pages/suggests/add.vue')},
        // 文章
        {path: '/blogs', name: '', component: () => import('../pages/blogs/index.vue')},
        {path: '/blogs/add_article', name: '', component: () => import('../pages/blogs/add_article.vue')},
        {path: '/blogs/add_dynamic', name: '', component: () => import('../pages/blogs/add_dynamic.vue')},
        {path: '/blogs/detail/:id', name: '', component: () => import('../pages/blogs/detail.vue')},
        {path: '/blogs/detail/:id/:share_uid', name: '', component: () => import('../pages/blogs/detail.vue')},

    ]
})

export default router
