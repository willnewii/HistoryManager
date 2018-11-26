<template>
    <Layout class="layout">
        <Sider hide-trigger :style="{background: '#fff'}">
            <Menu active-name="1" theme="light" width="auto" :open-names="['1']">
                <MenuItem name="1">历史记录</MenuItem>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-keypad"></Icon>
                        Item 2
                    </template>
                    <MenuItem name="2-1">Option 1</MenuItem>
                    <MenuItem name="2-2">Option 2</MenuItem>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <Icon type="ios-analytics"></Icon>
                        Item 3
                    </template>
                    <MenuItem name="3-1">Option 1</MenuItem>
                    <MenuItem name="3-2">Option 2</MenuItem>
                </Submenu>
            </Menu>
        </Sider>
        <Layout>
            <keep-alive :include="keepAliveArray">
                <router-view></router-view>
            </keep-alive>
        </Layout>
    </Layout>
</template>

<script>
    import {EventBus, Constants, mixins} from "../assets/js/index";

    const microsecondsDay = 1000 * 60 * 60 * 24;

    export default {
        name: "app",
        components: {},
        mixins: [mixins.base],
        data() {
            return {
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

<style lang="scss">
    @import "../assets/scss/base";

    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height: 100%;
    }

    .layout-logo {
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }

    .layout-nav {
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }
</style>
