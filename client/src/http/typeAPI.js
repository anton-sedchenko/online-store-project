import {$authHost, $host} from "./index.js";

export const createType = async (type) => {
    const {data} = await $authHost.post("/api/type", type);
    return data;
}

export const fetchTypes = async () => {
    const {data} = await $host.get("/api/type");

    console.log(`data-type: ${data}`);

    return data;
}

export const deleteType = async (id) => {
    const {data} = await $authHost.delete(`/api/type/${id}`);
    return data;
}
