<template>
    <div ref="table-view" class="table" :style="{ height: tableHeight + 'px' }">
        <app-header @onData="onData" :count="datas.length">
            <template v-if="selectGroup && selectGroup.length > 0">
                <Button class="button" type="error" @click="doDelete">
                    {{ $t('message.btn_delete') }}({{ selectGroup.length }})
                </Button>
                <Button class="button" @click="doCancle">{{ $t('message.btn_cancel') }}</Button>
            </template>
        </app-header>
        <div class="item header">
            <input class="checkbox" type="checkbox" v-model="allSelect" @change="onAllSelect" />
            <span class="visitTime">{{ $t('message.table_visitTime') }}</span>
            <span class="title">{{ $t('message.table_title') }}</span>
            <span class="url">url</span>
            <!--<span class="count">{{$t('message.table_visitCount')}}</span>-->
        </div>
        <div ref="list-view" style="flex-grow: 1; overflow-y: auto;">
            <div class="item" v-for="(data, index) in datas" :key="index" @click.stop="openWindow(data.url)">
                <input class="checkbox" type="checkbox" :value="data.id" v-model="selectGroup" v-on:click.stop />
                <span class="visitTime">{{ data.date }}</span>
                <img
                    v-if="inChrome"
                    class="website-icon"
                    id="icon"
                    v-lazy="'chrome://favicon/size/16@1x/' + data.url"
                />
                <span class="title">{{ data.title }}</span>
                <span class="url">{{ data.url }}</span>
                <span class="menu" @click.stop="showMenu(data, index)">┇</span>
                <!--<span class="count">{{data.visitCount}}</span>-->
            </div>
        </div>
        <Modal v-model="menu.show" :closable="false" class-name="vertical-center-modal">
            <span class="title">{{ menu.item.url }}</span>
            <p class="modal-item-p" @click="action(2)">打开</p>
            <p class="modal-item-p" @click="action(0)">来自该网站的更多内容</p>
            <p class="modal-item-p" @click="action(1)">从历史记录中移除</p>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
import { Constants, EventBus, mixins } from '../assets/js/index';

import AppHeader from '../components/AppHeader';

export default {
    components: { AppHeader },
    mixins: [mixins.base],
    name: Constants.PageName.list,
    data() {
        return {
            tableHeight: 0,
            allSelect: false,
            datas: [],
            selectGroup: [],
            menu: {
                show: false,
                item: {}
            },
            loadCheckbox: false,
            isLoaded: false
        };
    },
    computed: {},
    watch: {
        /*datas: function (val, oldVal) {
            if (this.$refs['list-view']) {
                this.$refs['list-view'].scrollTop = 0;
            }
            if (this.$refs['recycle-list']) {
                this.isLoaded = false;
                this.loadCheckbox = false;
                this.$refs['recycle-list'].init();
                setTimeout(() => {
                    //checkbox 导致列表渲染异常缓慢.异步显示
                    this.loadCheckbox = true;
                }, 0);
            }
        }*/
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.tableHeight = this.$refs['table-view'].offsetHeight;
        });
    },
    activated() {
        if (this.$route.query.host) {
            EventBus.$emit(Constants.EventBus.search, { keyword: this.$route.query.host });
        } else if (this.$route.query.day) {
            EventBus.$emit(Constants.EventBus.search, { day: this.$route.query.day });
        }
    },
    methods: {
        showMenu(item, index) {
            this.menu.item = item;
            this.menu.item.index = index;
            this.menu.show = true;
        },
        action(type) {
            switch (type) {
                case 0: //搜索
                    EventBus.$emit(Constants.EventBus.search, {
                        keyword: new URL(this.menu.item.url).hostname
                    });
                    break;
                case 1: //删除
                    EventBus.$emit(Constants.EventBus.delete, this.menu.item);
                    break;
                case 2: //打开
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
                setTimeout(() => {
                    //checkbox 导致列表渲染异常缓慢.异步显示
                    this.loadCheckbox = true;
                }, 0);
            });
        },
        openWindow(url) {
            this.createWindow(url);
        },
        onAllSelect(event) {
            this.selectGroup = [];
            if (event.target.checked) {
                this.selectGroup = this.datas.map((item) => {
                    return item.id;
                });
            }
        },
        onData(data) {
            this.datas = data;
        },
        doCancle() {
            this.allSelect = false;
            this.selectGroup = [];
        },
        doDelete() {
            for (let i = 0; i < this.datas.length; i++) {
                if (this.selectGroup.indexOf(this.datas[i].id) !== -1) {
                    this.deleteHistory({
                        url: this.datas[i].url
                    });
                    let index = this.datas.indexOf(this.datas[i]);
                    this.datas.splice(index, 1);
                    i--;
                }
            }

            this.doCancle();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/scss/params';

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
        background-color: #ffffff;
        padding: 0 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid #e8eaec;
        height: 48px;
        line-height: 48px;
        cursor: pointer;

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

    .title {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ivu-modal {
        top: 0;
    }

    .ivu-modal-footer {
        display: none;
    }
}
</style>
