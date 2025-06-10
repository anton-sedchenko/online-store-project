import {$authHost, $host} from "./index.js";

export const createType = async (type) => {
    const {data} = await $authHost.post("/api/type", type);
    return data;
}

export const fetchTypes = async () => {
    const {data} = await $host.get("/api/type");
    return data;
}

export const createFigure = async (figure) => {
    const {data} = await $authHost.post("/api/figure", figure);
    return data;
}

export const fetchFigure = async () => {
    const {data} = await $host.get("/api/figure");
    return data;
}

export const fetchOneFigure = async (id) => {
    const {data} = await $host.get("/api/figure/" + id);
    return data;
}
