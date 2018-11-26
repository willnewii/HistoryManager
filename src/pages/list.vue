<template>
    <div class="page">
        <Header>
            <!--<div class="layout-logo"></div>-->

            <div class="header-nav">
                <div class="actions" v-if="selection && selection.length > 0">
                    <Button class="button" @click="doDelete">删除({{selection.length}})</Button>
                    <Button class="button" @click="doCancle">取消</Button>
                </div>

                <div class="result">{{tipStr}} {{datas.length}}条数据</div>

                <Input search enter-button="Search" placeholder="Enter something..." />

                <Date-Picker @on-change='onDateChange' type="daterange" split-panels placement="bottom-end"
                             placeholder="选取日期" style="width: 200px;"></Date-Picker>
                <!--<Button @click="doSearch">搜索</Button>-->
            </div>
        </Header>

        <div ref='table-view' class='table' :style="{height:tableHeight + 'px'}">
            <!-- <div class="item" v-for='item in datas'>
                <span class="visitTime">{{formatTime(item.visitTime)}}</span>
                <span class="title">{{item.title}}</span>
                <span class="url">{{item.url}}</span>
            </div> -->
            <Table ref="table" v-if='tableHeight > 0' @on-selection-change="onSelect" :columns="columns" :data="datas"
                   :height='tableHeight'></Table>
        </div>
    </div>
</template>

<script>
    import {Constants, EventBus, mixins, util} from "../assets/js/index";

    import mockData from '../mock';
    import dayjs from 'dayjs';

    const microsecondsDay = 1000 * 60 * 60 * 24;

    export default {
        mixins: [mixins.base],
        name: Constants.PageName.list,
        data() {
            return {
                tipStr: '',
                tableHeight: 0,
                datas: [],
                selection: [],
                columns: [{
                    type: 'selection',
                    width: 80,
                    align: 'center'
                }, {
                    title: '查看时间',
                    key: 'visitTime', // lastVisitTime visitTime
                    width: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('span', util.formatTime(params.row.visitTime))
                        ]);
                    }
                }, {
                    title: '标题',
                    key: 'title',
                    width: 200,
                }, {
                    title: 'url',
                    key: 'url',
                    // width: '60%',
                }, {
                    title: '查看次数',
                    key: 'visitCount',
                    width: 100,
                },
                ]
            };
        },
        created() {
            this.doSearch();
        },
        mounted() {
            this.$nextTick(() => {
                this.tableHeight = this.$refs['table-view'].offsetHeight;
            });
        },
        methods: {
            formatTime: util.formatTime,
            doSearch() {
                this.search();
            },
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
                let ids = [];
                for (let item of this.selection) {
                    ids.push(item.id);
                }

                for (let item of this.datas) {
                    if (ids.indexOf(item.id) !== -1) {
                        if (this.inChrome) {
                            chrome.history.deleteRange({
                                startTime: item.visitTime,
                                endTime: item.visitTime + 1
                            }, () => {
                            });
                        }
                        let index = this.datas.indexOf(item);
                        console.log(index, this.datas.length);
                        this.datas.splice(index, 1);
                    }
                }
                this.doCancle();
            },
            doCancle() {
                this.$refs['table'].selectAll(false);
            },
            onSelect(selection) {
                this.selection = selection;
            },
            search(option = {}) {
                console.time('数据查询');
                option.endTime = option.endTime || (new Date).getTime();
                option.startTime = option.startTime || option.endTime - microsecondsDay;

                let visits = [];
                let getVisitsCount = 0;

                this.$Spin.show();
                if (chrome.history) {
                    chrome.history.search({
                            'text': option.text || '',
                            'startTime': option.startTime, //默认查询最近一天
                            'endTime': option.endTime,
                            'maxResults': 500
                        },
                        (historyItems) => {


                            historyItems.sort(function (a, b) {
                                return b.lastVisitTime - a.lastVisitTime;
                                // return a.lastVisitTime - b.lastVisitTime;
                            });
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
                                        this.setData(visits);

                                    }
                                });
                            }
                        });
                } else {
                    this.setData(mockData.searchData);
                }
            },
            setData(datas) {
                console.timeEnd('数据查询');
                this.$Spin.hide();
                this.datas = datas;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/params";

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

        .result {
            color: #ffffff;
            margin-right: 10px;
        }
    }

    .table {
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
        .item {
            padding: 10px;
            display: flex;
            flex-direction: row;
        }

        .visitTime {
            flex-shrink: 0;
        }

        .title {
            margin-left: 20px;
            width: 200px;
            flex-shrink: 0;
            word-break: break-all;
        }

        .url {
            margin-left: 20px;
            overflow: hidden;
            word-break: break-all;
        }
    }
</style>
<style>
    .ivu-layout-header {
        height: 49px;
        line-height: 49px;
        padding: 0 30px;
    }
</style>
