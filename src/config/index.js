/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod' 
const EnvConfig = {
    dev:{
        baseApi:'/',
        mockApi:'https://www.fastmock.site/mock/9e3b8dde068bc489a50776828c2e154f/api'
    },
    test:{
        baseApi:'//test.futurefe.com/api',
        mockApi:'https://www.fastmock.site/mock/9e3b8dde068bc489a50776828c2e154f/api'
    },
    prod:{
        baseApi:'//futurefe.com/api',
        mockApi:'https://www.fastmock.site/mock/9e3b8dde068bc489a50776828c2e154f/api'
    }
}
export default {
    env,
    mock: true,
    namespace: 'manager',
    ...EnvConfig[env]
}