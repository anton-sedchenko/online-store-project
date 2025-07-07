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
    return data.user;
}

export const fetchAuthUser = async () => {
    const {data} = await $authHost.get('/api/user/auth');

    // шукаєм баг // railway trigger
    console.log("👤 fetchAuthUser result", data);

    return data;
};

export const updateProfile = async ({firstName, lastName, email, phone}) => {
    const {data} = await $authHost.put('/api/user/profile', {firstName, lastName, email, phone});
    return data;
};

export const changePassword = async ({oldPassword, newPassword}) => {
    const {data} = await $authHost.put('/api/user/password', {oldPassword, newPassword});
    return data;
};

export const requestPasswordReset = async (email) => {
    const {data} = await $host.post('/api/user/request-reset', {email});
    return data;
};

export const resetPassword = async (token, password) => {
    const {data} = await $host.post('/api/user/reset-password', {token, password});
    return data;
};
