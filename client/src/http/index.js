import axios from "axios";

// Приходимо або з повним URL (може бути з /api, може без), або порожнім (той самий origin)
const raw = (import.meta.env.VITE_APP_API_URL || '').replace(/\/+$/, '');

// Якщо env порожній → працюємо по тому ж origin і додаємо "/api"
const baseURL = raw
    ? (raw.endsWith('/api') ? raw : `${raw}/api`)
    : '/api';

// інстанс для запитів без авторизації
const $host = axios.create({
    baseURL,
    withCredentials: true,
});

// інстанс для запитів з авторизацією
const $authHost = axios.create({
    baseURL,
    withCredentials: true,
});

const authInterceptor = config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.authorization = `Bearer ${token}`;
    return config;
};
$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };