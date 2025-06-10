import {$authHost, $host} from "./index.js";

export const registration = async (email, password) => {
    const {data} = await $host.post(
        "/api/user/registration",
        {email, password, role: "ADMIN"}
    );
    localStorage.setItem("token", data.token);
    return data;
}

export const login = async (email, password) => {
    const {data} = await $host.post(
        "/api/user/login",
        {email, password}
    );
    localStorage.setItem("token", data.token);
    return data;
}

export const check = async () => {
    const {data} = await $authHost.get("/api/user/auth");
    return data.token;
}
