import {$authHost, $host} from "./index.js";

export const createCategory = async formData => {
    const {data} = await $authHost.post(
        '/type',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
    );
    return data;
};

export const fetchOneType = async id => {
    const {data} = await $host.get(`/type/${id}`);
    return data;
};

export const updateType = async (id, body) => {
    const {data} = await $authHost.put(`/type/${id}`, body);
    return data;
};

export const updateTypeImage = async (id, formData) => {
    const {data} = await $authHost.put(`/type/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

//

export const createType = async (type) => {
    const {data} = await $authHost.post("/type", type);
    return data;
}

export const fetchTypes = async () => {
    const {data} = await $host.get("/type");
    return data;
}

export const deleteType = async (id) => {
    const {data} = await $authHost.delete(`/type/${id}`);
    return data;
}
