import axios from "axios";
import {Toast} from "vant";
import NET_CODE from "@/utils/ResultCode";
import {router} from "@/router";

// axios 基础参数设置
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.defaults.withCredentials = true;

// http request 拦截器
// 携带 token 到 header
// 对请求错误进行处理
axios.interceptors.request.use(config => {
    let token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    Toast.fail('请求错误, 请重试');
    return Promise.reject(err);
  });

// http response 拦截器
// 读取 data 直接返回给 调用对象
// 对请求错误进行处理
axios.interceptors.response.use(response => {
    // 判断请求是否成功
    let respData = response.data;
    // console.log('respdata:', respData);
    if (!respData || !respData.state) {
      // 打印消息
      return Promise.reject(errorHandle(response));
    } else {
      // 直接返回 data 数据
      return respData.data;
    }
  }, error => {
    const data = errorHandle(error ? error.response : {});
    console.log('response error:', error);
    // 返回接口返回的错误信息
    return Promise.reject(data);
  }
);

const errorHandle = (response) => {
  let {data} = response || {};
  if (!data) {
    data = {code: '-1'};
  }
  let msg = NET_CODE[data.code] || data.msg || NET_CODE['-1'];
  console.log('error data:', data, ', msg: ', msg);
  Toast(msg);
  switch (data.code) {
    case '403':
      // 跳转到首页
      router.replace({name: 'homepage'})
      break;
    case "2":
      // 跳转到登录页
      router.replace({name: 'login'})
      break;
    default:
    // 默认错误，不处理
  }
  return data;
}

const get = (url, data) => {
  return axios.get(url, data);
}

const post = (url, data) => {
  return axios.post(url, data);
}


export default {
  get,
  post,
  axios
};


