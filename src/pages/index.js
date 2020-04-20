import * as Constants from '../assets/js/Constants';

let page = {};
// page[Constants.PageName.app] = resolve => require(['../layouts/app.vue'], resolve);

page[Constants.PageName.layout] = (resolve) => require(['../components/AppLayout.vue'], resolve);

page[Constants.PageName.list] = (resolve) => require(['./list.vue'], resolve);
// page[Constants.PageName.table] = (resolve) => require(['./table.vue'], resolve);
page[Constants.PageName.analyze] = (resolve) => require(['./analyze.vue'], resolve);

/*.forEach((item) => {
    // page[item] = resolve => require([`./${item}.vue`], resolve);
    page[item] = () =>
            import(
                    /!* webpackChunkName: "[request]" *!/
                    `./${item}`
                    );
});*/

export default page;
