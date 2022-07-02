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
            mock: true,
        })
    }
}