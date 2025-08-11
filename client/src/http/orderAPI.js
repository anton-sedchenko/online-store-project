import {$host, $authHost} from "./index.js";

// Створити замовлення
export const createOrder = async (orderData, isAuth) => {
    const client = isAuth ? $authHost : $host;
    const {data} = await client.post("/order", orderData)
    return data
}

// історія своїх замовлень
export const fetchMyOrders = async () => {
    const {data} = await $authHost.get("/order");
    return data;
};

// всі замовлення для адміна
export const fetchAllOrders = async () => {
    const {data} = await $authHost.get("/order/all");
    return data;
};

// деталізований перегляд одного замовлення
export const fetchOneOrder = async (orderId) => {
    const {data} = await $authHost.get(`/order/${orderId}`);
    return data;
};
