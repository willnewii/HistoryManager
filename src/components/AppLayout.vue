<template>
    <Layout class="layout">
        <Layout>
            <Sider class="sider" hide-trigger :style="{ background: '#fff' }">
                <Menu :active-name="menuIndex" theme="light" width="auto">
                    <MenuItem name="1" to="/list">{{ $t('message.title_history') }}</MenuItem>
                    <MenuItem name="2" to="/analyze">{{ $t('message.title_analyze') }}</MenuItem>
                </Menu>
            </Sider>
            <Layout>
<!--                <app-header></app-header>-->
                <keep-alive :include="keepAliveArray">
                    <router-view></router-view>
                </keep-alive>
            </Layout>
        </Layout>
    </Layout>
</template>

<script>
import { Constants, mixins } from '../assets/js/index';
import AppHeader from '../components/AppHeader';

export default {
    name: 'AppLayout',
    components: { AppHeader },
    mixins: [mixins.base],
    data() {
        return {
            menuIndex: '1',
            keepAliveArray: Constants.keepAlive
        };
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.updateIndex(to.name, vm);
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.updateIndex(to.name, this);
        next();
    },
    created() {},
    methods: {
        updateIndex(name, vm) {
            switch (name) {
                case Constants.PageName.list:
                    vm.menuIndex = '1';
                    break;
                case Constants.PageName.analyze:
                    vm.menuIndex = '2';
                    break;
            }
        }
    }
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
