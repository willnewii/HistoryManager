<template>
    <div class="page">
        123
        <div>{{count}}</div>
        <div>{{page_count}}</div>
        <div>{{env}}</div>
    </div>
</template>

<script>
    import {Constants, EventBus, mixins} from '../assets/js/index';

    export default {
        components: {},
        mixins: [mixins.base, mixins.request],
        name: Constants.PageName.demo_page,
        data() {
            return {
                env: process.env.NODE_ENV
            };
        },
        computed: {
        },
        created() {
        },
        methods: {
            toast() {
                EventBus.$emit(Constants.EventBus.showToast, {message: '测试toast'});
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/params";

    .title {
        display: block;
        padding: px2rem(16);
        font-size: px2rem(16);
        margin: 0;
    }
</style>
