import axios from 'axios'
import router from '@/router'
import { MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log(response)
    const res = response.data
    const status = response.status
    if (status === 401) {
      // to re-login
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Notification({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log(error.message) // for debug

    if (error.message.indexOf('400') !== -1) {
      router.back()
      Notification({
        message: '没有权限',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (error.message.indexOf('422') !== -1) {
      Notification({
        message: '请规范填写',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (error.message.indexOf('500') !== -1) {
      Notification({
        message: '系统错误',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Notification({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
