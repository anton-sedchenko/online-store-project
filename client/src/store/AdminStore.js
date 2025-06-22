import {makeAutoObservable, runInAction} from 'mobx';
import {fetchFigures} from '../http/figureAPI';
// import {fetchUsers}   from '../http/userAPI';

export default class AdminStore {
    products = [];
    productsTotal = 0;
    productsPage = 1;
    productsLimit = 10;
    // users = [];
    // usersTotal = 0;
    // usersPage = 1;
    // usersLimit = 10;

    constructor() {
        makeAutoObservable(this);
    }

    // Товари

    setProductsPage(page) {
        this.productsPage = page;
        this.loadProducts();
    }

    async loadProducts() {
        const data = await fetchFigures(null, this.productsPage, this.productsLimit);
        runInAction(() => {
            this.products = data.rows;
            this.productsTotal = data.count;
        });
    }

    // Юзери

    // setUsersPage(p) {
    //     this.usersPage = p;
    //     this.loadUsers();
    // }
    // async loadUsers() {
    //     const data = await fetchUsers(this.usersPage, this.usersLimit);
    //     this.users = data.rows;
    //     this.usersTotal = data.count;
    // }
}