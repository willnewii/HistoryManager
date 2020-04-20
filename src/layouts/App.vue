<template>
    <router-view></router-view>
</template>

<script>
import { EventBus, Constants } from '../assets/js/index';

export default {
    name: 'app',
    created() {
        EventBus.$on(Constants.EventBus.showToast, (value) => {
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
@import '../assets/scss/base';
</style>
