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
        })
    },
    noticesCount() {
        return request({
            url: '/leave/count',
            method: 'GET',
            data: {}, 
        })
    },
    getMenuList() {
        return request({
            url: '/menu/list',
            method: 'GET',
            data: {}, 
        })
    },

}