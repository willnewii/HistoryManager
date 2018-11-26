import Vue from 'vue';

import 'iview/dist/styles/iview.css';

import {
    DatePicker,
    Button,
    Table,
    Header,
    Menu,
    Icon,
    Sider,
    Spin,
    Layout,
    Input
} from 'iview';

Vue.component('DatePicker', DatePicker);
Vue.component('Button', Button);
Vue.component('Table', Table);
Vue.component('Header', Header);
Vue.component('Menu', Menu);
Vue.component('MenuItem', Menu.Item);
Vue.component('Submenu', Menu.Sub);
Vue.component('Sider', Sider);
Vue.component('Icon', Icon);
Vue.component('Spin', Spin);
Vue.component('Layout', Layout);
Vue.component('Input', Input);

Vue.prototype.$Spin = Spin;