import Vue from 'vue';
import Router from 'vue-router';
import Pages from '../pages/index';
import * as Constants from '../assets/js/Constants';

function generateRoute(name, meta) {
    return {
        path: name,
        name: name,
        component: Pages[name],
        meta: Object.assign({ keepAlive: true }, meta)
    };
}

Vue.use(Router);

let routes = [
    {
        path: '/',
        component: Pages[Constants.PageName.layout],
        children: [
            {
                path: '',
                component: Pages[Constants.PageName.list],
                meta: Object.assign({ keepAlive: true }, { title: '历史记录' })
            },
            generateRoute(Constants.PageName.list, { title: '历史记录' }),
            generateRoute(Constants.PageName.analyze, { title: '数据分析' })
        ]
    }
];

/* routes.push({
    path: '/',
    redirect: {
        name: Constants.PageName.list,
    }
}); */
let router = new Router({
    routes
});

router.afterEach((to, from) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title + (process.env.NODE_ENV !== 'production' ? '-dev' : '');
    }
});

export default router;
