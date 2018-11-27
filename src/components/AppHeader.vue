<template>
    <Header>
        <div class="header-nav">
            <div class="actions" v-if="selection && selection.length > 0">
                <Button class="button" @click="doDelete">{{$t('message.btn_delete')}}({{selection.length}})</Button>
                <Button class="button" @click="doCancle">{{$t('message.btn_cancel')}}</Button>
            </div>

            <div class="result">{{$t('message.resultCount', [datas.length])}}</div>

            <Input v-model="keyword" icon="ios-search" :placeholder="$t('message.str_search')"
                   class="search" @on-click="doSearch"/>

            <Date-Picker @on-change='onDateChange' type="daterange" split-panels placement="bottom-end"
                         :placeholder="$t('message.pick_date')" style="width: 200px;"></Date-Picker>
        </div>
    </Header>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";
    import * as types from "../vuex/mutation-types";

    import mockData from '../mock';
    import dayjs from 'dayjs';

    const microsecondsDay = 1000 * 60 * 60 * 24;

    export default {
        name: 'AppHeader',
        props: {
            test: {
                type: String,
                default: 'i am a template components'
            }
        },
        data() {
            return {
                keyword: '',
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

                let option = {
                    startTime: dayjs(values[0]).valueOf(),
                    endTime: dayjs(values[1]).valueOf() + microsecondsDay
                };
                this.search(option);
            },
            doDelete() {
                let tempdatas = JSON.parse(JSON.stringify(this.datas));

                for (let i = 0; i < tempdatas.length; i++) {
                    if (this.selection.indexOf(tempdatas[i].id) !== -1) {
                        if (this.inChrome) {
                            chrome.history.deleteRange({
                                startTime: tempdatas[i].visitTime,
                                endTime: tempdatas[i].visitTime + 1
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
                console.log(this.keyword);
                this.search();
            },
            search(option = {}) {
                console.time('数据查询');
                option.endTime = option.endTime || (new Date).getTime();
                option.startTime = option.startTime || option.endTime - microsecondsDay * 7;
                option.text = this.keyword || '';

                let visits = [];
                let getVisitsCount = 0;

                this.$Spin.show();
                if (chrome.history) {
                    chrome.history.search({
                            'text': option.text,
                            'startTime': option.startTime, //默认查询最近一天
                            'endTime': option.endTime,
                            'maxResults': 1000
                        },
                        (historyItems) => {
                            this.historyItems = historyItems;
                            getVisitsCount = historyItems.length;

                            for (let item of historyItems) {
                                chrome.history.getVisits({
                                    url: item.url
                                }, (lists) => {
                                    getVisitsCount--;
                                    let results = lists.filter((value) => {
                                        value.url = item.url;
                                        value.title = item.title;
                                        value.visitCount = item.visitCount;
                                        return (value.visitTime >= option.startTime && value.visitTime < option.endTime);
                                    });
                                    //visits = visits.concat(results);
                                    //只显示时间段内最近的一条
                                    visits.push(results[results.length - 1]);
                                    if (getVisitsCount === 0) {

                                        visits.sort(function (a, b) {
                                            return b.visitTime - a.visitTime;
                                        });

                                        this.setData(visits);
                                    }
                                });
                            }
                        });
                } else {
                    // this.getPageView();
                    this.setData(mockData.visitData);
                }
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
</style>