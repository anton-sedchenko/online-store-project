import {$authHost, $host} from "./index.js";
import {jwtDecode} from "jwt-decode";

export const registration = async (email, password) => {
    const {data} = await $host.post(
        "/user/registration",
        {email, password, role: "USER"}
    );
    localStorage.setItem("token", data.token);
    return jwtDecode(data.token);
}

export const login = async (email, password) => {
    const {data} = await $host.post(
        "/user/login",
        {email, password}
    );
    localStorage.setItem("token", data.token);
    return data.user;
}

export const fetchAuthUser = async () => {
    const {data} = await $authHost.get('/user/auth');
    return data;
};

export const updateProfile = async ({firstName, lastName, email, phone}) => {
    const {data} = await $authHost.put('/user/profile', {firstName, lastName, email, phone});
    return data;
};

export const changePassword = async ({oldPassword, newPassword}) => {
    const {data} = await $authHost.put('/user/password', {oldPassword, newPassword});
    return data;
};

export const requestPasswordReset = async (email) => {
    const {data} = await $host.post('/user/request-reset', {email});
    return data;
};

export const resetPassword = async (token, password) => {
    const {data} = await $host.post('/user/reset-password', {token, password});
    return data;
};
