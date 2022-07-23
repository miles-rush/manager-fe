/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
    dev: {
        baseApi: 'https://www.mirrormoon.top:7980/api/',
        mockApi: 'https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api'
    },
    test: {
        baseApi: 'https://www.mirrormoon.top:7980/api/',
        mockApi: 'https://www.fastmock.site/mock/9e3b8dde068bc489a50776828c2e154f/api'
    },
    production: {
        baseApi: 'https://www.mirrormoon.top:7980/api/',
        mockApi: 'https://www.fastmock.site/mock/9e3b8dde068bc489a50776828c2e154f/api'
    }
}
export default {
    env,
    mock: true,
    namespace: 'manager',
    ...EnvConfig[env]
}