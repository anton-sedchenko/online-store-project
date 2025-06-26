import {makeAutoObservable} from "mobx";
import {fetchTypes as _fetchTypesAPI} from "../http/typeAPI.js";

export default class ProductStore {
    constructor() {
        this._types = [];
        this._products = [];
        this._selectedType = {};
        this._totalCount = 0;
        this._currentPage = 1;
        this._productsCountOnCurrentRequest = 0;
        this._productsLimitOnOnePage = 8;
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }

    setProducts(products) {
        this._products = products;
    }

    setSelectedType(type) {
        this._selectedType = type;
    }

    setCurrentPage(page) {
        this._currentPage = page;
    }

    setProductsCountOnCurrentRequest(count) {
        this._productsCountOnCurrentRequest = count;
    }

    setTotalCount(count) {
        this._totalCount = count;
    }

    setProductsLimitOnOnePage(limit) {
        this._productsLimitOnOnePage = limit;
    }

    get types() {
        return this._types;
    }

    async fetchTypes() {
        const data = await _fetchTypesAPI();
        this.setTypes(data);
    }

    get products() {
        return this._products;
    }

    get selectedType() {
        return this._selectedType;
    }

    get currentPage() {
        return this._currentPage;
    }

    get totalCount() {
        return this._totalCount;
    }

    get productsCountOnCurrentRequest() {
        return this._productsCountOnCurrentRequest;
    }

    get productsLimitOnOnePage() {
        return this._productsLimitOnOnePage;
    }
}
