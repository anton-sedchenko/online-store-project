import {$authHost, $host} from "./index.js";

export const fetchProductBySlug = async (slug) => {
    const {data} = await $host.get(`/product/slug/${slug}`);
    return data;
};

export const createProduct = async (formData) => {
    const {data} = await $authHost.post(
        "/product",
        formData,
        {headers: {"Content-Type": "multipart/form-data"}}
    );
    return data;
}

export const updateProduct = async (id, formData) => {
    const {data} = await $authHost.put(`/product/${id}`, formData, {
        headers: {"Content-Type": "multipart/form-data"}
    });
    return data;
};

export const fetchProducts = async (typeId, page, limit = 4) => {
    const params = {page, limit};
    if (typeId !== null) {
        params.typeId = typeId;
    }
    const {data} = await $host.get("/product", {params});
    return data;
}

export const fetchOneProduct = async (id) => {
    const {data} = await $host.get(`/product/${id}`);
    return data;
}

export const deleteProduct = async (id) => {
    const {data} = await $authHost.delete(`/product/${id}`);
    return data;
}

export const deleteProductImage = (id) => {
    return $authHost.delete(`/product/image/${id}`);
};
