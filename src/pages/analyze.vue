<template>
    <div ref="view" class="page" :style="{ height: viewHeight + 'px' }">
        <app-header id="analyze" @onData="onData" :count="datas.length" :type="1"></app-header>
        <div style="overflow-y: auto;">
            <div class="chart2" ref="chart2"></div>
            <div class="chart1" ref="chart1"></div>
        </div>
    </div>
</template>

<script>
import { Constants, mixins, util, analyze } from '../assets/js/index';

import Highcharts from '../assets/js/hc';
import AppHeader from '../components/AppHeader';

export default {
    components: { AppHeader },
    mixins: [mixins.base],
    name: Constants.PageName.analyze,
    data() {
        return {
            viewHeight: 0,
            datas: 0
        };
    },
    watch: {
        datas: function (val) {
            if (val.length > 0) {
                this.getDatas();
            }
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.viewHeight = this.$refs['view'].offsetHeight;
            if (this.datas.length > 0) {
                this.getDatas();
            }
        });
    },
    methods: {
        onData(data) {
            this.datas = data;
        },
        getDatas() {
            this.getPageView();

            this.getDominView();
        },
        getPageView() {
            let result = analyze.getPageView(this.datas);
            Highcharts.chart(this.$refs.chart1, {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '页面打开数'
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
                        text: ''
                    }
                },
                legend: {
                    enabled: false,
                    align: 'right'
                },
                series: [
                    {
                        name: '页面打开数',
                        data: result.count,
                        maxPointWidth: 10,
                        minPointWidth: 1,
                        dataLabels: {
                            enabled: true
                        },
                        events: {
                            click: (event) => {
                                this.pushPage({
                                    name: Constants.PageName.list,
                                    query: { day: event.point.category }
                                });
                            }
                        }
                    }
                ]
            });
        },
        getDominView() {
            let result = analyze.getTopSite(this.datas).slice(0, 20);

            let datas = [];
            for (let item of result) {
                datas.push({ name: new URL(item.url).hostname, y: item.count });
            }

            Highcharts.chart(this.$refs.chart2, {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: '网站排行'
                },
                subtitle: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                legend: {
                    align: 'right'
                },
                series: [
                    {
                        name: '网站排行',
                        data: datas,
                        events: {
                            click: (event) => {
                                this.pushPage({
                                    name: Constants.PageName.list,
                                    query: { host: event.point.name }
                                });
                            }
                        }
                    }
                ]
            });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/scss/params';

.page {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
</style>
