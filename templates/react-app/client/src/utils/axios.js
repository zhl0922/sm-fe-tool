import axios from 'axios';
axios.interceptors.request.use(config => {
    return config;
}, err => {
    return Promise.reject(err.message);
})
axios.interceptors.response.use((res) => {
    let { data } = res;
    return data;
}, err => {
	return Promise.reject(err.message);
})
const proxy = (config) => {
    return axios(config);
}
proxy.get = (path, data = {}, config = {}) => {
    if (!path) {
        console.error('path can not be empty');
        return Promise.reject('path can not be empty');
    }
    return axios({
        url: path,
        method: 'GET',
        params: data,
        custom: true,
        ...config
    });
}
proxy.post = (path, data = {}, config = {}) => {
    if (!path) {
        console.error('path can not be empty');
        return Promise.reject('path can not be empty');
    }
    return axios({
        url: path,
        method: 'POST',
        data: data,
        custom: true,
        ...config
    });
}
export default proxy