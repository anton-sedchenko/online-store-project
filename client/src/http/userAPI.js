import {$authHost, $host} from "./index.js";
import {jwtDecode} from "jwt-decode";

export const registration = async (email, password) => {
    const {data} = await $host.post(
        "/api/user/registration",
        {email, password, role: "USER"}
    );
    localStorage.setItem("token", data.token);
    return jwtDecode(data.token);
}

export const login = async (email, password) => {
    const {data} = await $host.post(
        "/api/user/login",
        {email, password}
    );
    localStorage.setItem("token", data.token);
    return jwtDecode(data.token);
}

export const fetchAuthUser = async () => {
    const {data} = await $authHost.get('/api/user/auth');
    return data;
};

export class checkAuth {
}