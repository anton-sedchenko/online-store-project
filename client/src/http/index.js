import axios from "axios";

const BASE = import.meta.env.VITE_APP_API_URL || "";

// інстанси
const $host = axios.create({
    baseURL: BASE,
    withCredentials: true,
});

const $authHost = axios.create({
    baseURL: BASE,
    withCredentials: true,
});

// Додаємо /api для всіх відносних шляхів, але не дублюємо, якщо вже є
function ensureApiPrefix(config) {
    // абсолютні URL не чіпаємо
    if (/^https?:\/\//i.test(config.url || "")) return config;

    // щоб було завжди з "/" попереду
    if (!config.url || !config.url.startsWith("/")) {
        config.url = `/${config.url || ""}`;
    }

    const baseHasApi = /\/api\/?$/.test(BASE);
    const urlHasApi  = config.url.startsWith("/api/") || config.url === "/api";

    // Якщо base уже закінчується на /api — нічого не додаємо.
    // Якщо ні — додаємо /api попереду кожного відносного url, який його не має.
    if (!baseHasApi && !urlHasApi) {
        config.url = `/api${config.url}`;
    }
    return config;
}

// токен + префікс для $authHost
$authHost.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.authorization = `Bearer ${token}`;
    return ensureApiPrefix(config);
});

// префікс для $host
$host.interceptors.request.use(ensureApiPrefix);

export { $host, $authHost };