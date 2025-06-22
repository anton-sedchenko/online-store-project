import {$authHost, $host} from "./index.js";

export const createFigure = async (figure) => {
    const {data} = await $authHost.post("/api/figure", figure);
    console.log(data);
    return data;
}

export const updateFigure = async (id, formData) => {
    const {data} = await $authHost.put(`/api/figure/${id}`, formData, {
        headers: {"Content-Type": "multipart/form-data"}
    });
    return data;
};

export const fetchFigures = async (typeId, page, limit = 4) => {
    const {data} = await $host.get("/api/figure", {
        params: {
            typeId: typeId || undefined,
            page,
            limit
        }
    });
    return data;
}

export const fetchOneFigure = async (id) => {
    const {data} = await $host.get(`/api/figure/${id}`);
    return data;
}

export const deleteProduct = async (id) => {
    const {data} = await $authHost.delete(`/api/figure/${id}`);
    return data;
}
