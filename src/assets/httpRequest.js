
import axios from 'axios'

const http = axios.create({
  timeout: 1000 * 60 * 10,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
window.SITE_CONFIG = {
  baseUrl: 'xxx'
}
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}


export default http
