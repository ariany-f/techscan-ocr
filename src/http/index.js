import axios from "axios"
import { ArmazenadorToken } from "../utils"

const http = axios.create({
    baseURL: 'https://api.uniebco.com.br'
})

http.interceptors.request.use(function (config) {
    const token = ArmazenadorToken.AccessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

const rotasIgnoradasPelosErros = [
    'api/web/public/users/login'
]

http.interceptors.response.use(
    (response) => response.data,
    function (error) {
        if(!rotasIgnoradasPelosErros.includes(error.config.url) 
        && error.response.status === 401) {
            // Faz logout e envia usuário de volta pro login
            return  ArmazenadorToken.removerToken()
        }
        
        return Promise.reject(error);
    }
);

export default http