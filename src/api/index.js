/**
 * api管理
 */
import request from './../util/request'
export default {
    login(params) {
        return request({
            url: '/users/login',
            method: 'POST',
            data: params,
            mock: false
        })
    },
    noticesCount() {
        return request({
            url: '/leave/count',
            method: 'GET',
            data: {},
            mock: true,
        })
    },
    getMenuList(params) {
        return request({
            url: '/menu/list',
            method: 'GET',
            data: params,
            mock: false,
        })
    },
    getUserList(params) {
        return request({
            url: '/users/list',
            method: 'GET',
            data: params,
            mock: false,
        })
    },
    userDel(params) {
        return request({
            url: '/users/delete',
            method: 'POST',
            data: params,
            mock: false,
        })
    },
    getRoleAllList() {
        return request({
            url: '/roles/allList',
            method: 'GET',
            data: {},
            mock: true,
        })
    },
    getRoleList(params) {
        return request({
            url: '/roles/list',
            method: 'GET',
            data: params,
            mock: false,
        })
    },
    getDeptList() {
        return request({
            url: '/dept/list',
            method: 'GET',
            data: {},
            mock: true,
        })
    },
    userSubmit(params) {
        return request({
            url: '/users/operate',
            method: 'POST',
            data: params,
            mock: false,
        })
    },
    menuSubmit(params) {
        return request({
            url: '/menu/operate',
            method: 'POST',
            data: params,
            mock: false,
        })
    },
    roleOperate(params) {
        return request({
            url: '/roles/operate',
            method: 'POST',
            data: params,
            mock: false,
        })
    },
    updatePermission(params) {
        return request({
            url: '/roles/update/permission',
            method: 'POST',
            data: params,
            mock: false,
        })
    },
}