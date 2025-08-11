import {$authHost} from "./index.js";

export const fetchCart = async () => {
    const {data} = await $authHost.get("/cart");
    return data;
};

export const addToCartAPI = async (productId, qty) => {
    const {data} = await $authHost.post("/cart", {productId, quantity: qty});
    return data;
};

export const updateCartItemAPI = async (cartProductId, qty) => {
    const {data} = await $authHost.put(`/cart/${cartProductId}`, {
        quantity: qty
    });
    return data;
};

export const removeCartItemAPI = async (cartProductId) => {
    const {data} = await $authHost.delete(`/cart/${cartProductId}`);
    return data;
};

export const clearCartAPI = async () => {
    const {data} = await $authHost.delete("/cart/clear");
    return data;
};
