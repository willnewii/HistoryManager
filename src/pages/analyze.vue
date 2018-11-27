<template>
    <div>
        <div ref="chart1"></div>
    </div>
</template>

<script>
    import {Constants, mixins, util, analyze} from "../assets/js/index";

    import {mapGetters, mapActions} from "vuex";
    import * as types from "../vuex/mutation-types";
    import Highcharts from "../assets/js/hc";

    export default {
        components: {},
        mixins: [mixins.base,],
        name: Constants.PageName.analyze,
        data() {
            return {
                env: process.env.NODE_ENV
            };
        },
        computed: {
            ...mapGetters({
                datas: types.APP.datas,
            })
        },
        created() {
        },
        mounted() {
            this.getPageView();
        },
        methods: {
            getPageView() {
                let result = analyze.getPageView(this.datas);
                console.log(result, this.$refs.chart1);
                Highcharts.chart(this.$refs.chart1, {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: result.dates,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '',
                        }
                    },
                    legend: {
                        align: 'right',
                    },
                    series: [{
                        name: '页面打开数',
                        data: result.count,
                        dataLabels: {
                            enabled: true,
                        }
                    }]
                });
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
