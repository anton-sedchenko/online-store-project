import {$host, $authHost} from "./index.js";

// для залогінених юзерів
export const createOrder = async (orderData) => {
    const {data} = await $authHost.post("/api/order", orderData);
    return data;
};

// для гостей
export const createOrderGuest = async (orderData) => {
    const {data} = await $host.post("/api/order/guest-cart", orderData);
    return data;
};

// історія своїх замовлень
export const fetchMyOrders = async () => {
    const {data} = await $host.get("/api/order");
    return data;
};

// всі замовлення для адміна
export const fetchAllOrders = async () => {
    const {data} = await $host.get("/api/order/all");
    return data;
};

// деталізований перегляд одного замовлення
export const fetchOneOrder = async (orderId) => {
    const {data} = await $host.get(`/api/order/${orderId}`);
    return data;
};
