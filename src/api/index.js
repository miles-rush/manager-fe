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
    getMenuList() {
        return request({
            url: '/menu/list',
            method: 'GET',
            data: {},
            mock: true,
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
    getRoleList() {
        return request({
            url: '/roles/allList',
            method: 'GET',
            data: {},
            mock: true,
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
    }
}