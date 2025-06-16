import {$authHost} from "./index.js";

export const fetchCart = async () => {
    const {data} = await $authHost.get("/api/cart");
    return data;
};

export const addToCartAPI = async (figureId, qty) => {
    const {data} = await $authHost.post("/api/cart", { figureId, quantity: qty });
    return data;
};

export const updateCartItemAPI = async (figureId, qty) => {
    const {data} = await $authHost.put(`/api/cart/${figureId}`, {
        quantity: qty
    });
    return data;
};

export const removeCartItemAPI = async (cartFigureId) => {
    const {data} = await $authHost.delete(`/api/cart/${cartFigureId}`);
    return data;
};

export const clearCartAPI = async () => {
    const {data} = await $authHost.delete("/api/cart/clear");
    return data;
};
