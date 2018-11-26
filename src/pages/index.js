import * as Constants from '../assets/js/Constants';

let page = {};
page[Constants.PageName.list] = resolve => require(['./list.vue'], resolve);
// page[Constants.PageName.demo_page] = resolve => require(['./demo_page.vue'], resolve);

export default page;
