import {makeAutoObservable} from "mobx";

export default class CartStore {
    constructor() {
        this._items = [];
        makeAutoObservable(this);
    }

    addItem(product, qty = 1) {
        const exist = this._items.find((item) => item.id === product.id);

        if (exist) {
            exist.quantity += qty;
        } else {
            this._items.push({...product, quantity: qty});
        }
    }

    removeItem(id) {
        this._items = this._items.filter((item) => item.id !== id);
    }

    setQuantity(id, qty) {
        const item = this._items.find((i) => i.id === id);
        if (!item) return;
        if (qty < 0) {
            item.quantity = 0;
        } else {
            item.quantity = qty;
        }
    }

    get items() {
        return this._items;
    }

    get total() {
        return this._items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
}
