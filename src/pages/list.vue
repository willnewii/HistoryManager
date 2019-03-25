<template>
    <div ref='table-view' class='table' :style="{height:tableHeight + 'px'}">
        <div class="item header">
            <input class="checkbox" type="checkbox" v-model="allSelect" @change="onAllSelect"></input>
            <span class="visitTime">{{$t('message.table_visitTime')}}</span>
            <span class="title">{{$t('message.table_title')}}</span>
            <span class="url">url</span>
            <!--<span class="count">{{$t('message.table_visitCount')}}</span>-->
        </div>
        <div ref="list-view" style="flex-grow: 1;overflow-y: auto;">
            <div v-if="true" class="item" v-for="(data,index) in datas">
                <input class="checkbox" type="checkbox" :value="data.id" v-model="selectCroup"></input>
                <span class="visitTime">{{data.date}}</span>
                <img v-if="inChrome" class="website-icon" id="icon"
                     v-lazy="'chrome://favicon/size/16@1x/' + data.url"/>
                <span class="title">{{data.title}}</span>
                <span class="url" @click="openWindow(data.url)">{{data.url}}</span>
                <span class="menu" @click="showMenu(data)">┇</span>
                <!--<span class="count">{{data.visitCount}}</span>-->
            </div>
            <CheckboxGroup v-else v-model="selectCroup" @on-change="onSelect">
                <recycle-list ref="recycle-list" :style="{height:listHeight + 'px'}"
                              :on-fetch="onFetch" :size="20">
                    <div class="item" slot="item" slot-scope="{ data }">
                        <div v-if="!loadCheckbox" class="checkbox"></div>
                        <Checkbox v-else class="checkbox" :label="data.id"><span></span></Checkbox>
                        <span class="visitTime">{{data.date}}</span>
                        <!--<span class="website-icon" id="icon"
                              :style="{'background-image': `-webkit-image-set(url(chrome://favicon/size/16@1x/${data.url}) 1x, url(chrome://favicon/size/16@2x/${data.url}) 2x)`}"></span>
                        --><span class="title">{{data.title}}</span>
                        <span class="url">{{data.url}}</span>
                        <span class="menu" @click="showMenu(data)">┇</span>
                        <!--<span class="count">{{data.visitCount}}</span>-->
                    </div>
                </recycle-list>
            </CheckboxGroup>
        </div>
        <Modal v-model="menu.show" :closable="false" class-name="vertical-center-modal">
            <span>{{menu.item.url}}</span>
            <p class="modal-item-p" @click="action(2)">打开</p>
            <p class="modal-item-p" @click="action(0)">来自该网站的更多内容</p>
            <p class="modal-item-p" @click="action(1)">从历史记录中移除</p>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>

<script>
    import {Constants, EventBus, mixins} from "../assets/js/index";

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
                menu: {
                    show: false,
                    item: {},
                }
            };
        },
        computed: {
            ...mapGetters({
                datas: types.APP.datas,
                selection: types.APP.selection,
            })
        },
        watch: {
            datas: function (val) {
                if (this.$refs['list-view']) {
                    this.$refs['list-view'].scrollTop = 0;
                }
                if (this.$refs['recycle-list']) {
                    this.isLoaded = false;
                    this.loadCheckbox = false;
                    this.$refs['recycle-list'].init();
                    setTimeout(() => {//checkbox 导致列表渲染异常缓慢.异步显示
                        this.loadCheckbox = true;
                    }, 0);
                }
            },
            selection: function (val, oldVal) {
                if (val.length === 0 && val.length !== oldVal.length) {
                    this.allSelect = false;
                    this.onAllSelect({target: {checked: false}});
                }
            },
            selectCroup: function () {
                this.actionSelection(this.selectCroup);
            }
        },
        created() {
        },
        mounted() {
            this.$nextTick(() => {
                this.tableHeight = this.$refs['table-view'].offsetHeight;
                this.listHeight = this.$refs['list-view'].offsetHeight;
            });
        },
        methods: {
            ...mapActions({
                actionSelection: types.APP.selection,
            }),
            showMenu(item) {
                this.menu.item = item;
                this.menu.show = true;
            },
            action(type) {
                switch (type) {
                    case 0://搜索
                        EventBus.$emit(Constants.EventBus.search, this.menu.item);
                        break;
                    case 1://删除
                        EventBus.$emit(Constants.EventBus.delete, this.menu.item);
                        break;
                    case 2://打开
                        chrome.tabs.create({
                            selected: true,
                            url: this.menu.item.url
                        });
                        break;
                }
                this.menu.show = false;
            },
            onFetch() {
                return new Promise((resolve) => {
                    if (!this.isLoaded) {
                        this.isLoaded = true;
                        resolve(this.datas);
                    } else {
                        resolve(false);
                    }
                    setTimeout(() => {//checkbox 导致列表渲染异常缓慢.异步显示
                        this.loadCheckbox = true;
                    }, 0);
                });
            },
            openWindow(url) {
                chrome.tabs.create({
                    selected: true,
                    url: url
                });
            },
            onSelect() {
                this.actionSelection(this.selectCroup);
            },
            onAllSelect(event) {
                if (event.target.checked) {
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
            flex-shrink: 0;

            .title {
                margin-left: 20px !important;
            }
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
            align-items: center;
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
                width: 200px;
                margin-left: 4px;
            }

            .website-icon {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
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

            .menu {
                width: 40px;
                text-align: center;
            }
        }

    }

    .modal-item-p {
        padding: 10px;

        &:nth-child(1) {
            border-bottom: 1px solid #f8f8f9;
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

    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal {
            top: 0;
        }

        .ivu-modal-footer {
            display: none;
        }
    }
</style>
