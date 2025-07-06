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
    try {
        const {data} = await $authHost.get('/api/user/auth');
        return data;
    } catch (e) {
        console.log("Користувач не авторизований");
        return null;
    }
};

export const updateProfile = async ({firstName, lastName, email, phone}) => {
    const {data} = await $authHost.put('/api/user/profile', {firstName, lastName, email, phone});
    return data;
};

export const changePassword = async ({oldPassword, newPassword}) => {
    const {data} = await $authHost.put('/api/user/password', {oldPassword, newPassword});
    return data;
};
