import axios from "axios";
import { getCookie } from "cookies-next";

export const api = axios.create({
    baseURL: 'https://api-teste-front-production.up.railway.app',
})

api.interceptors.request.use((config) => {
    const token = getCookie("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});