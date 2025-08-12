import axios from "axios";

const apiBase = import.meta.env.VITE_APP_API_URL || "";

// інстанс для запитів без авторизації
const $host = axios.create({
    baseURL: apiBase,
    withCredentials: true,
});

// інстанс для запитів з авторизацією
const $authHost = axios.create({
    baseURL: apiBase,
    withCredentials: true,
});

// токен у заголовок
const authInterceptor = (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.authorization = `Bearer ${token}`;
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };