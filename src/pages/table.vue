<template>
    <div ref='table-view' class='table' :style="{height:tableHeight + 'px'}">
        <Table ref="table" v-if='tableHeight > 0' @on-selection-change="onSelect" :columns="columns" :data="datas"
               :height='tableHeight'></Table>
    </div>
</template>

<script>
    import {Constants, EventBus, mixins, util, analyze} from "../assets/js/index";

    import {mapGetters, mapActions} from "vuex";
    import * as types from "../vuex/mutation-types";

    import mockData from '../mock';

    export default {
        mixins: [mixins.base],
        name: Constants.PageName.list,
        data() {
            return {
                tableHeight: 0,
                columns: [{
                    type: 'selection',
                    width: 50,
                    align: 'center'
                }, {
                    title: this.$i18n.t('message.table_visitTime'),
                    key: 'visitTime', // lastVisitTime visitTime
                    width: 130,
                    render: (h, params) => {
                        return h('div', [
                            h('span', util.formatTime(params.row.visitTime))
                        ]);
                    }
                }, {
                    title: this.$i18n.t('message.table_title'),
                    key: 'title',
                    width: 200,
                    className: 'table-title-column'
                }, {
                    title: 'url',
                    key: 'url',
                    // width: '60%',
                }, {
                    title: this.$i18n.t('message.table_visitCount'),
                    key: 'visitCount',
                    width: 60,
                    align: 'center'
                },
                ]
            };
        },
        computed: {
            ...mapGetters({
                datas: types.APP.datas,
                selection: types.APP.selection,
            })
        },
        watch: {
            selection: function (val, oldVal) {
                console.log(val, oldVal);
                if (val.length === 0 && val.length !== oldVal.length) {
                    this.$refs['table'].selectAll(false);
                }
            }
        },
        created() {
        },
        mounted() {
            this.$nextTick(() => {
                this.tableHeight = this.$refs['table-view'].offsetHeight;
            });
        },
        methods: {
            ...mapActions({
                actionSelection: types.APP.selection,
            }),
            formatTime: util.formatTime,
            onSelect(selection) {
                this.actionSelection(selection);
            },
            //统计同一域名
            getPageView() {
                analyze.getPageView(mockData.visitData);
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/params";

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
<style lang="scss">
    .table-title-column {
        span {
            white-space: nowrap;
        }
    }

    .ivu-table-cell {
        padding-left: 5px;
        padding-right: 5px;
    }
</style>
