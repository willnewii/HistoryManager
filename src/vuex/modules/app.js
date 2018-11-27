/**
 * Created by zhangweiwei on 2017/2/28.
 */
import * as types from '../mutation-types';

export default {
    state: {
        app: {
            datas: [],       //搜索结果
            selection: []    //已选择列表
        }
    },
    mutations: {
        [types.APP.datas](state, value) {
            state.app.datas = value;
        },
        [types.APP.selection](state, value) {
            state.app.selection = value;
        },
    },
    actions: {
        [types.APP.datas](context, value) {
            context.commit(types.APP.datas, value);
        },
        [types.APP.selection](context, value) {
            context.commit(types.APP.selection, value);
        },
    },
    getters: {
        [types.APP.datas](state) {
            return state.app.datas;
        },
        [types.APP.selection](state) {
            return state.app.selection;
        },

    }
};