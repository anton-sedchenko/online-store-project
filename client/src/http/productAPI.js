import {$authHost, $host} from "./index.js";

export const fetchProductBySlug = async (slug) => {
    const {data} = await $host.get(`/api/product/slug/${slug}`);
    return data;
};

export const createProduct = async (product) => {
    const {data} = await $authHost.post("/api/product", product);
    return data;
}

export const updateProduct = async (id, formData) => {
    const {data} = await $authHost.put(`/api/product/${id}`, formData, {
        headers: {"Content-Type": "multipart/form-data"}
    });
    return data;
};

export const fetchProducts = async (typeId, page, limit = 4) => {
    const params = {page, limit};
    if (typeId !== null) {
        params.typeId = typeId;
    }
    const {data} = await $host.get("/api/product", {params});
    return data;
}

export const fetchOneProduct = async (id) => {
    const {data} = await $host.get(`/api/product/${id}`);
    return data;
}

export const deleteProduct = async (id) => {
    const {data} = await $authHost.delete(`/api/product/${id}`);
    return data;
}

export const deleteProductImage = (id) => {
    return $authHost.delete(`api/product/image/${id}`);
};
