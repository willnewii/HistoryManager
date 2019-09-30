<template>
    <Header>
        <div class="header-nav">
            <div class="actions" v-if="selection && selection.length > 0">
                <Button class="button" type="error" @click="doDelete">
                    {{$t('message.btn_delete')}}({{selection.length}})
                </Button>
                <Button class="button" @click="doCancle">{{$t('message.btn_cancel')}}</Button>
            </div>

            <div class="result">{{$t('message.resultCount', [datas.length])}}</div>
            <Input v-model="keyword" icon="ios-search" :placeholder="$t('message.str_search')"
                   class="search" @on-click="doSearch" @on-enter="doSearch"/>

            <Date-Picker @on-change='onDateChange' style="width: 200px;"
                         type="daterange" split-panels
                         placement="bottom-end"
                         :options="dataOptions" :placeholder="$t('message.pick_date')"></Date-Picker>
        </div>
    </Header>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";
    import * as types from "../vuex/mutation-types";

    import {EventBus, Constants, mixins} from "../assets/js/index";

    import dayjs from 'dayjs';

    const microsecondsDay = 1000 * 3600 * 24;

    export default {
        name: 'AppHeader',
        mixins: [mixins.base],
        props: {},
        data() {
            return {
                keyword: '',
                startTime: 0,
                endTime: 0,
                dataOptions: {
                    shortcuts: [
                        {
                            text: this.$i18n.t('message.nearly_a_week'),
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - microsecondsDay * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: this.$i18n.t('message.nearly_a_month'),
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - microsecondsDay * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: this.$i18n.t('message.nearly_three_month'),
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - microsecondsDay * 90);
                                return [start, end];
                            }
                        }
                    ]
                }
            };
        },
        computed: {
            ...mapGetters({
                datas: types.APP.datas,
                selection: types.APP.selection
            })
        },
        created() {
            this.doSearch();

            EventBus.$on(Constants.EventBus.search, (option) => {
                if (option.keyword) {
                    this.keyword = option.keyword;
                }
                if (option.day) {
                    this.keyword = '';
                    this.startTime = dayjs(option.day).valueOf();
                    this.endTime = dayjs(option.day).add(1, 'day').valueOf();
                }
                this.doSearch();
            });

            EventBus.$on(Constants.EventBus.delete, (value) => {
                console.log(value);
            });
        },
        methods: {
            ...mapActions({
                actionDatas: types.APP.datas,
                actionSelection: types.APP.selection,
            }),
            onDateChange(values) {
                if (!values[0] && !values[1]) {
                    return;
                }

                this.startTime = dayjs(values[0]).valueOf();
                this.endTime = dayjs(values[1]).valueOf();
                this.doSearch();
            },
            doDelete() {
                let tempdatas = JSON.parse(JSON.stringify(this.datas));

                for (let i = 0; i < tempdatas.length; i++) {
                    if (this.selection.indexOf(tempdatas[i].id) !== -1) {
                        if (this.inChrome) {
                            //删除当前URL的所有记录
                            chrome.history.deleteUrl({
                                url: tempdatas[i].url,
                            }, () => {
                            });
                        }
                        let index = tempdatas.indexOf(tempdatas[i]);
                        tempdatas.splice(index, 1);
                        i--;
                    }
                }

                this.actionDatas(tempdatas);
                this.doCancle();
            },
            doCancle() {
                this.actionSelection([]);
            },
            doSearch() {
                this.search({
                    startTime: this.startTime,
                    endTime: this.endTime,
                    text: this.keyword
                });
            },
            search(option = {}) {
                // console.trace();
                //TODO:搜索策略变更
                console.time('数据查询');
                let date = new Date();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                // 默认范围最近七天的记录
                if (!option.startTime && !option.endTime) {
                    option.startTime = option.startTime || dayjs(date.getTime()).subtract(6, 'day').valueOf();
                    option.endTime = option.endTime || dayjs(date.getTime()).add(1, 'day').valueOf();
                } else {
                    //endTime应该包括当天日期
                    option.endTime = dayjs(option.endTime).add(1, 'day').valueOf();
                }
                option.text = option.text || '';

                console.log({
                    'text': option.text,
                    'startTime': dayjs(option.startTime).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'), //默认查询最近一天
                    'endTime': dayjs(option.endTime).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'),
                });

                this.$Spin.show();
                this.getHistory({
                    'text': option.text,
                    'startTime': option.startTime, //默认查询最近一天
                    'endTime': option.endTime,
                    'maxResults': 5000,
                    'callback': (data) => {
                        this.setData(data);
                    }
                });
            },
            setData(datas) {
                console.timeEnd('数据查询');
                this.$Spin.hide();
                this.actionDatas(datas);
            },
        }
    };
</script>

<style lang="scss" scoped>
    .header-nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        .actions {
            flex-grow: 1;
        }

        .button {
            margin-right: px2rem(10);
        }

        .search {
            width: 200px;
            margin-right: 10px;
        }

        .result {
            color: #ffffff;
            margin-right: 10px;
        }
    }
</style>
<style lang="scss">
    .ivu-layout-header {
        height: 49px;
        line-height: 49px;
        padding: 0 30px;
    }

    .ivu-picker-panel-sidebar {
        width: 110px;
        margin-left: -110px;
    }
</style>
