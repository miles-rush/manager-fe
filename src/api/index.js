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
            mock: false,
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
    getPermissionList() {
        return request({
            url: '/users/getPermissionList',
            method: 'GET',
            data: {},
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
    getAllUserList() {
        return request({
            url: '/users/all/list',
            method: 'GET',
            data: {},
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
            mock: false,
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
    getDeptList(params) {
        return request({
            url: '/dept/list',
            method: 'GET',
            data: params,
            mock: false,
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
    deptOperate(params) {
        return request({
            url: '/dept/operate',
            method: 'POST',
            data: params,
            mock: false,
        })
    },
    getApplyList(params) {
        return request({
            url: '/leave/list',
            method: 'GET',
            data: params,
            mock: false,
        })
    },
    leaveOperate(params) {
        return request({
            url: '/leave/operate',
            method: 'POST',
            data: params,
            mock: false,
        })
    },
    leaveApprove(params) {
        return request({
            url: '/leave/approve',
            method: 'POST',
            data: params,
            mock: false,
        })
    }

}