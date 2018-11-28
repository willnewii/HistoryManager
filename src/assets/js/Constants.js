/**
 * Created by zhangweiwei on 16/9/7.
 */

//用于管理router中页面名称
export const PageName = {
    analyze: 'analyze',
    list: 'list',
    table: 'table',
    app: 'app'
};

//用于管理是否需要使用keepAlive缓存
export const keepAlive = [
    PageName.list,
    PageName.analyze,
];

//用于管理LocalStorage key
export const LocalStorage = {
    test: 'test',
};


//用于管理EventBus中的事件key
export const EventBus = {
    search: 'search',
    delete: 'delete',
};
