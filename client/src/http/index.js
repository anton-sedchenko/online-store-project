import axios from "axios";

const rawBase = import.meta.env.VITE_APP_API_URL || "";
const apiBase = rawBase.replace(/\/api\/?$/, "");

// шукаєм баг з подвійним /api в урл
console.log("HTTP baseURL =", apiBase);

// інстанс для запитів без авторизації
const $host = axios.create({
    baseURL: apiBase,
    withCredentials: true,
});

// інстанс для запитів з авторицією
const $authHost = axios.create({
    baseURL: apiBase,
    withCredentials: true,
});

// При кожному запиті в заголовки конфіга додаєм токен з локал стореджа
const authInterceptor = config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.authorization = `Bearer ${token}`;
    return config;
}

$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
}
