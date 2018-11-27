<template>
    <Layout class="layout">
        <app-header></app-header>
        <Layout>
            <Sider class="sider" hide-trigger :style="{background: '#fff'}">
                <Menu active-name="1" theme="light" width="auto" :open-names="['1']">
                    <MenuItem name="1" to="/list">{{$t('message.title_history')}}</MenuItem>
                    <MenuItem name="2" to="/analyze">{{$t('message.title_analyze')}}</MenuItem>
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
    import {EventBus, Constants, mixins} from "../assets/js/index";
    import AppHeader from "../components/AppHeader";

    export default {
        name: "app",
        components: {AppHeader},
        mixins: [mixins.base],
        data() {
            return {
                selection: [],
                datas: [],
                keepAliveArray: Constants.keepAlive,
                toast: {
                    show: false,
                    message: "",
                    Timer: null
                }
            };
        },
        created() {
            EventBus.$on(Constants.EventBus.showToast, value => {
                this.showMessage(value);
            });
        },
        methods: {
            showMessage(value) {
                this.toast.show = true;
                this.toast.message = value.message;

                if (this.toast.Timer) clearTimeout(this.toast.Timer);
                this.toast.Timer = setTimeout(() => {
                    this.toast.show = false;
                }, 2000);
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
<style lang="scss">
    @import "../assets/scss/base";
</style>
