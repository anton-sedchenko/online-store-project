import axios from "axios";

// інстанс для запитів без авторизації
const $host = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL
});

// інстанс для запитів з авторицією
const $authHost = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL
});

// При кожному запиті в заголовки конфіга додаєм токен з локал стореджа
const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
}

$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
}
