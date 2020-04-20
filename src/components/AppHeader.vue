<template>
    <Header>
        <div class="header-nav">
            <div class="actions" v-if="selection && selection.length > 0">
                <Button class="button" type="error" @click="doDelete">
                    {{ $t('message.btn_delete') }}({{ selection.length }})
                </Button>
                <Button class="button" @click="doCancle">{{ $t('message.btn_cancel') }}</Button>
            </div>

            <div class="result">{{ $t('message.resultCount', [datas.length]) }}</div>
            <Input
                v-model="keyword"
                icon="ios-search"
                :placeholder="$t('message.str_search')"
                class="search"
                @on-click="doSearch"
                @on-enter="doSearch"
            />

            <Date-Picker
                @on-change="onDateChange"
                style="width: 200px;"
                :value="times"
                type="daterange"
                split-panels
                placement="bottom-end"
                :options="dataOptions"
                :placeholder="$t('message.pick_date')"
            ></Date-Picker>
        </div>
    </Header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as types from '../vuex/mutation-types';

import { EventBus, Constants, mixins, util } from '../assets/js/index';

import dayjs from 'dayjs';

const microsecondsDay = 1000 * 3600 * 24;

export default {
    name: 'AppHeader',
    mixins: [mixins.base],
    props: {},
    data() {
        return {
            keyword: '',
            times: [],
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
        // 默认范围最近七天的记录
        let date = util.getDayTime();
        this.times = [
            dayjs(date.getTime()).subtract(6, 'day').toDate(),
            dayjs(date.getTime()).add(1, 'day').toDate()
        ];

        this.doSearch();

        EventBus.$on(Constants.EventBus.search, (option) => {
            if (option.keyword) {
                this.keyword = option.keyword;
            }
            if (option.day) {
                // 指定日期的搜索
                this.keyword = '';
                this.times = [dayjs(option.day).toDate(), dayjs(option.day).add(1, 'day').toDate()];
            }
            this.doSearch();
        });

        EventBus.$on(Constants.EventBus.delete, (item) => {
            this.doDelete(item);
        });
    },
    methods: {
        ...mapActions({
            actionDatas: types.APP.datas,
            actionSelection: types.APP.selection
        }),
        onDateChange(values) {
            if (!values[0] && !values[1]) {
                return;
            }

            this.times[0] = dayjs(values[0]).toDate();
            this.times[1] = dayjs(values[1]).add(1, 'day').toDate();

            this.doSearch();
        },
        doDelete(item) {
            let totalDatas = JSON.parse(JSON.stringify(this.datas));

            if (item && !isNaN(item.index)) {
                totalDatas.splice(item.index, 1);
            } else {
                //TODO: 返回下标数组
                for (let i = 0; i < totalDatas.length; i++) {
                    if (this.selection.indexOf(totalDatas[i].id) !== -1) {
                        this.deleteHistory({
                            url: totalDatas[i].url
                        });
                        let index = totalDatas.indexOf(totalDatas[i]);
                        totalDatas.splice(index, 1);
                        i--;
                    }
                }
            }

            this.actionDatas(totalDatas);
            this.doCancle();
        },
        doCancle() {
            this.actionSelection([]);
        },
        doSearch() {
            this.search({
                startTime: this.times[0],
                endTime: this.times[1],
                text: this.keyword
            });
        },
        search(option = {}) {
            // console.trace();
            //TODO: 搜索策略变更
            console.time('数据查询');

            option.text = option.text || '';

            console.log('查询参数:', {
                text: option.text,
                startTime: dayjs(option.startTime).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'), //默认查询最近一天
                endTime: dayjs(option.endTime).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A')
            });
            console.log('查询参数  :', option);

            this.$Spin.show();
            this.getHistory({
                text: option.text,
                startTime: option.startTime.getTime(), //默认查询最近一天
                endTime: option.endTime.getTime(),
                maxResults: 5000,
                callback: (data) => {
                    this.setData(data);
                }
            });
        },
        setData(datas) {
            console.timeEnd('数据查询');
            this.$Spin.hide();
            this.actionDatas(datas);
        }
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
