import {makeAutoObservable} from "mobx";
import {fetchAuthUser} from "../http/userAPI.js";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        makeAutoObservable(this);
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;
    }

    get isAuth() {
        return this._isAuth;
    }

    async checkAuth() {
        try {
            const me = await fetchAuthUser();
            this.setUser(me);
            this.setIsAuth(true);
        } catch {
            this.setIsAuth(false);
            this.setUser({});
        }
    }

    get user() {
        return this._user;
    }
}
