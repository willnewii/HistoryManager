<template>
    <div ref='table-view' class='table' :style="{height:tableHeight + 'px'}">
        <div class="item header">
            <Checkbox class="checkbox" v-model="allSelect" @on-change="onAllSelect"></Checkbox>
            <span class="visitTime">{{$t('message.table_visitTime')}}</span>
            <span class="title">{{$t('message.table_title')}}</span>
            <span class="url">url</span>
            <span class="count">{{$t('message.table_visitCount')}}</span>
        </div>
        <div ref="list-view" style="flex-grow: 1">
            <CheckboxGroup v-model="selectCroup" @on-change="onSelect">
                <!--<div class="item" v-for='(item,index) in datas' :key="index">
                    <div v-if="!loadCheckbox" class="checkbox"></div>
                    <Checkbox v-else class="checkbox" :label="item.id"><span></span></Checkbox>
                    <span class="visitTime">{{formatTime(item.visitTime)}}</span>
                    <span class="title">{{item.title}}</span>
                    <span class="url">{{item.url}}</span>
                    <span class="count">{{item.visitCount}}</span>
                </div>-->
                <recycle-list v-if="datas.length > 0" :style="{height:listHeight + 'px'}" :on-fetch="onFetch">
                    <div class="item" slot="item" slot-scope="{ data }">
                        <div v-if="!loadCheckbox" class="checkbox"></div>
                        <Checkbox v-else class="checkbox" :label="data.id"><span></span></Checkbox>
                        <span class="visitTime">{{formatTime(data.visitTime)}}</span>
                        <span class="title">{{data.title}}</span>
                        <span class="url">{{data.url}}</span>
                        <span class="count">{{data.visitCount}}</span>
                    </div>
                </recycle-list>
            </CheckboxGroup>
        </div>
    </div>
</template>

<script>
    import {Constants, mixins, util} from "../assets/js/index";

    import {mapGetters, mapActions} from "vuex";
    import * as types from "../vuex/mutation-types";
    import RecycleList from "../components/recycle-list";

    export default {
        components: {RecycleList},
        mixins: [mixins.base],
        name: Constants.PageName.list,
        data() {
            return {
                tableHeight: 0,
                listHeight: 0,
                isLoaded: false,
                loadCheckbox: false,
                allSelect: false,
                selectCroup: [],
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
                if (val.length === 0 && val.length !== oldVal.length) {
                    this.allSelect = false;
                    this.onAllSelect(false);
                }
            }
        },
        created() {
        },
        mounted() {
            this.$nextTick(() => {
                this.tableHeight = this.$refs['table-view'].offsetHeight;
                this.listHeight = this.$refs['list-view'].offsetHeight;

                setTimeout(() => {//checkbox 导致列表渲染异常缓慢.异步显示
                    this.loadCheckbox = true;
                }, 0);
            });
        },
        methods: {
            ...mapActions({
                actionSelection: types.APP.selection,
            }),
            formatTime: util.formatTime,
            onFetch() {
                return new Promise((resolve) => {
                    if (!this.isLoaded) {
                        this.isLoaded = true;
                        resolve(this.datas);
                    } else {
                        resolve(false);
                    }

                });
            },
            onSelect() {
                this.actionSelection(this.selectCroup);
            },
            onAllSelect(status) {
                if (status) {
                    this.selectCroup = [];
                    for (let i = 0; i < this.datas.length; i++) {
                        this.selectCroup.push(this.datas[i].id);
                    }
                } else {
                    this.selectCroup = [];
                }
                this.onSelect();
            },
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/params";

    .table {
        flex-grow: 1;
        display: flex;
        flex-direction: column;

        .header {
            background-color: #f8f8f9 !important;
            height: 40px !important;
            line-height: 40px !important;
        }

        .scroll {
            height: 100%;
            overflow: scroll;
            -webkit-overflow-scrolling: touch;
        }

        .item {
            background-color: #FFFFFF;
            padding: 0 10px;
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid #e8eaec;
            height: 48px;
            line-height: 48px;

            span {
                word-break: break-all;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 12px;
                flex-shrink: 0;
            }

            .checkbox {
                flex-shrink: 0;
                width: 50px;
                margin-right: 0px;
            }

            .visitTime {
                width: 150px;
                margin-right: 0;
            }

            .title {
                margin-left: 20px;
                width: 200px;
            }

            .url {
                flex-shrink: 1;
                margin-left: 20px;
                flex-grow: 1;
            }

            .count {
                width: 40px;
                text-align: center;
            }
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

    .checkbox {
    }
</style>
