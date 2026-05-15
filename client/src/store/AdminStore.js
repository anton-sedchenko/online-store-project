import {makeAutoObservable, runInAction} from 'mobx';
import {fetchProducts} from '../http/productAPI';

export default class AdminStore {
    products = [];
    productsTotal = 0;
    productsPage = 1;
    productsLimit = 10;

    constructor() {
        makeAutoObservable(this);
    }

    setProductsPage(page) {
        this.productsPage = page;
        this.loadProducts();
    }

    async loadProducts() {
        const data = await fetchProducts(
            null,
            this.productsPage,
            this.productsLimit,
            'code'
        );

        runInAction(() => {
            this.products = data.rows;
            this.productsTotal = data.count;
        });
    }
}