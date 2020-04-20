<template>
    <Layout class="layout">
        <app-header></app-header>
        <Layout>
            <Sider class="sider" hide-trigger :style="{ background: '#fff' }">
                <Menu :active-name="menuIndex" theme="light" width="auto">
                    <MenuItem name="1" to="/list">{{ $t('message.title_history') }}</MenuItem>
                    <MenuItem name="2" to="/analyze">{{ $t('message.title_analyze') }}</MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <keep-alive :include="keepAliveArray">
                    <router-view></router-view>
                </keep-alive>
            </Layout>
        </Layout>
    </Layout>
</template>

<script>
import { EventBus, Constants, mixins } from '../assets/js/index';
import AppHeader from '../components/AppHeader';

export default {
    name: 'AppLayout',
    components: { AppHeader },
    mixins: [mixins.base],
    data() {
        return {
            menuIndex: '1',
            selection: [],
            datas: [],
            keepAliveArray: Constants.keepAlive,
            toast: {
                show: false,
                message: '',
                Timer: null
            }
        };
    },
    beforeRouteUpdate(to, from, next) {
        switch (to.name) {
            case Constants.PageName.list:
                this.menuIndex = '1';
                break;
            case Constants.PageName.analyze:
                this.menuIndex = '2';
                break;
        }
        next();
    },
    created() {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.layout {
    height: 100%;
}

.sider {
    border-right: 1px solid #e8eaec;
}
</style>
