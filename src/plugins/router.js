import Vue from 'vue';
import Router from 'vue-router';
import Pages from '../pages/index';
import * as Constants from '../assets/js/Constants';

function generateRoute(name, meta) {
    return {
        path: '/' + name.replace(/-/g, '/'),
        name: name,
        component: Pages[name],
        meta: Object.assign({keepAlive: true}, meta)
    };
}

function addRouter(name, meta) {
    routes.push(generateRoute(name, meta));
}

Vue.use(Router);

let routes = [
    generateRoute(Constants.PageName.list, {title: '历史记录'}),
    generateRoute(Constants.PageName.analyze, {title: '数据分析'})
];

let router = new Router({
    routes
});


router.afterEach((to, from) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title;
    }
});

export default router;
