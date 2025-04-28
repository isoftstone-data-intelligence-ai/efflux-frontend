import axios from 'axios'

axios.defaults.timeout = 300000

axios.defaults.baseURL = process.env.apiUrl;

// 请求拦截器
axios.interceptors.request.use(
    (config) => {
        // 从 localStorage 获取 token
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers['Authorization'] = token;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//HTTPrequest拦截
axios.interceptors.response.use(
    (config) => {
        return config;
    },
    (error) => {
        // 如果是 401 未授权，清除 token 并跳转到登录页
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
            }
        }
        var obj = {
            code: 503,
            data:{},
            message:'',
            sub_code:503,
            sub_message:'',
        }
        if(!error.response) return {data:obj}
        error.response.data = obj
        return error.response;
    }
);

export default axios;
