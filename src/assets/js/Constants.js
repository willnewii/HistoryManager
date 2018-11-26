/**
 * Created by zhangweiwei on 16/9/7.
 */

const BASE_URL = 'https://anxinmuying.applinzi.com/Public/demo/?';

//用于管理项目请求地址
export const Method = {
    test: BASE_URL + "service=Album.GetList",
};

//用于管理router中页面名称
export const PageName = {
    index: 'index',
    demo_page: 'demo_page',
    list: 'list'
};

//用于管理是否需要使用keepAlive缓存
export const keepAlive = [
    PageName.index
];

//用于管理LocalStorage key
export const LocalStorage = {
    test: 'test',
};


//用于管理EventBus中的事件key
export const EventBus = {
    showToast: 'showToast',
    toggleDrawer: 'toggleDrawer',
    toggleMusic: 'toggleMusic',
    userLogin: 'userLogin',
    setTitle: 'setTitle',
    setTitleLeftIcon: 'setTitleLeftIcon',
    update_main_tab_index: 'update_main_tab_index'
};
