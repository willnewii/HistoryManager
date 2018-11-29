import Vue from 'vue';
import VueI18n from 'vue-i18n';

import 'iview/dist/styles/iview.css';

import {
    DatePicker,
    Button,
    Header,
    Menu,
    Icon,
    Sider,
    Spin,
    Layout,
    Input,
    Modal,
} from 'iview';

Vue.component('DatePicker', DatePicker);
Vue.component('Button', Button);
Vue.component('Header', Header);
Vue.component('Menu', Menu);
Vue.component('MenuItem', Menu.Item);
Vue.component('Submenu', Menu.Sub);
Vue.component('Sider', Sider);
Vue.component('Icon', Icon);
Vue.component('Spin', Spin);
Vue.component('Layout', Layout);
Vue.component('Input', Input);
Vue.component('Modal', Modal);

Vue.prototype.$Spin = Spin;

Vue.use(VueI18n);

const messages = {
    'zh-CN': {
        message: {
            str_search: '搜索历史记录',
            pick_date: '选取日期',
            btn_delete: '删除',
            btn_cancel: '取消',
            resultCount: '{0} 条数据',
            title_history: '历史记录',
            title_analyze: '分析',
            table_visitTime: '查看时间',
            table_title: '标题',
            table_visitCount: '查看次数',
            nearly_a_week: '近一周',
            nearly_a_month: '近一月',
            nearly_three_month: '近三月',
        },
    },
    en: {
        message: {
            str_search: 'Search history',
            pick_date: 'Date of selection',
            btn_delete: 'delete',
            btn_cancel: 'cancel',
            resultCount: '{0} datas',
            title_history: 'History',
            title_analyze: 'Analyze',
            table_visitTime: 'visitTime',
            table_title: 'title',
            table_visitCount: 'count',
            nearly_a_week: '1 week ago',
            nearly_a_month: '1 month ago',
            nearly_three_month: '3 months ago',
        },
    },

};

const i18n = new VueI18n({
    locale: window.navigator.language === '1zh-CN' ? 'zh-CN' : 'en', // set locale
    messages, // set locale messages
});

import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload);

export {i18n};