import {$authHost, $host} from "./index.js";

export const createCategory = async formData => {
    const {data} = await $authHost.post(
        '/api/type',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
    );
    return data;
};

export const fetchOneType = async id => {
    const {data} = await $host.get(`/api/type/${id}`);
    return data;
};

export const updateType = async (id, body) => {
    const {data} = await $authHost.put(`/api/type/${id}`, body);
    return data;
};

export const updateTypeImage = async (id, formData) => {
    const {data} = await $authHost.put(`/api/type/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

//

export const createType = async (type) => {
    const {data} = await $authHost.post("/api/type", type);
    return data;
}

export const fetchTypes = async () => {
    const {data} = await $host.get("/api/type");
    return data;
}

export const deleteType = async (id) => {
    const {data} = await $authHost.delete(`/api/type/${id}`);
    return data;
}
