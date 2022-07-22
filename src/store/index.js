/**
 * Vuex状态管理
 */
import { createStore } from 'vuex';
import mutations from './mutations';
import storage from './../util/storage';

const state = {
    userInfo: storage.getItem("userInfo") || {}, // 用户信息
    menuList: storage.getItem("menuList") || [],
    actionList: storage.getItem("actionList") || [],
    noticeCount: 0
}
export default createStore({
    state,
    mutations
})