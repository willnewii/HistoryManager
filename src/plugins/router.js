import Vue from 'vue';
import Router from 'vue-router';
import Pages from '../pages/index';
import * as Constants from '../assets/js/Constants';

function addRouter(name, meta) {
    routes.push({
        path: '/' + name.replace(/-/g, '/'),
        name: name,
        component: Pages[name],
        meta: Object.assign({keepAlive: true}, meta)
    });
}

Vue.use(Router);

let routes = [{
    path: '/',
    name: Constants.PageName.list,
    component: Pages[Constants.PageName.list],
    meta: {keepAlive: true, title: '历史记录'},
    children: []
}];

let router = new Router({
    routes
});


router.afterEach((to, from) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title;
    }
});

export default router;
