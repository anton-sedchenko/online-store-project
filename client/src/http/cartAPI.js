import {$authHost} from "./index.js";

export const fetchCart = async () => {
    const {data} = await $authHost.get("/api/cart");
    return data;
};

export const addToCartAPI = async (productId, qty) => {
    const {data} = await $authHost.post("/api/cart", {productId, quantity: qty});
    return data;
};

export const updateCartItemAPI = async (cartProductId, qty) => {
    const {data} = await $authHost.put(`/api/cart/${cartProductId}`, {
        quantity: qty
    });
    return data;
};

export const removeCartItemAPI = async (cartProductId) => {
    const {data} = await $authHost.delete(`/api/cart/${cartProductId}`);
    return data;
};

export const clearCartAPI = async () => {
    const {data} = await $authHost.delete("/api/cart/clear");
    return data;
};
