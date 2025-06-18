import {makeAutoObservable, runInAction} from "mobx";
import {addToCartAPI, clearCartAPI, fetchCart, removeCartItemAPI, updateCartItemAPI} from "../http/cartAPI.js";

const GUEST_CART_KEY = "guestCart";
const CART_TTL_MS = 24 * 60 * 60 * 1000; // 24 години - строк життя гостьового кошика

export default class CartStore {
    _items = [];
    _isGuest = true;

    constructor(user) {
        makeAutoObservable(this);
        this._user = user;
        this._isGuest = !user.isAuth;
        if (this._isGuest) {
            this.loadGuestCart();
        } else {
            this.loadCart();
        }
    }

    // Методи перемикачі кошиків між гостем та юзером
    // Викликаємо після логіну
    async switchToAuth() {
        this._isGuest = false;
        await this.loadCart();
    }

    // Викликаємо після логауту
    switchToGuest() {
        this._isGuest = true;
        this.loadGuestCart();
    }

    // Локальні гостьові методи

    loadGuestCart() {
        const raw = localStorage.getItem(GUEST_CART_KEY);
        if (!raw) return;
        try {
            const {items, timestamp} = JSON.parse(raw);
            const age = Date.now() - timestamp;
            if (age > CART_TTL_MS) {
                localStorage.removeItem(GUEST_CART_KEY); // Кошик занадто старий, видаляємо
                return;
            }
            runInAction(() => {this._items = items});
        } catch {
            localStorage.removeItem(GUEST_CART_KEY);
        }
    }

    saveGuestCart() {
        const payload = {
            items: this._items,
            timestamp: Date.now()
        };
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(payload));
    }

    // Серверні методи

    async loadCart() {
        try {
            const raw = await fetchCart();
            const items = raw.map(ci => ({
                cartFigureId: ci.id,
                figureId: ci.figureId,
                id: ci.figure.id,
                name: ci.figure.name,
                price: ci.figure.price,
                img: ci.figure.img,
                quantity: ci.quantity
            }));
            // Кладемо нормалізований масив в store
            runInAction(() => {this._items = items});
        } catch (e) {
            console.error("Не вдалося завантажити кошик", e);
        }
    }

    // Уніфіковані методи

    async addItem(product, qty = 1) {
        if (this._isGuest) {
            // Гість
            const exist = this._items.find(i => i.id === product.id);
            if (exist) {
                exist.quantity += qty;
            } else {
                this._items.push({ ...product, quantity: qty });
            }
            this.saveGuestCart();
        } else {
            // Авторизований
            await addToCartAPI(product.id, qty);
            await this.loadCart();
        }
    }

    async setQuantity(cartFigureId, qty) {
        if (this._isGuest) {
            // гостьова логіка зміни кількості товару
            const item = this._items.find(i => i.id === cartFigureId)
            if (!item) return
            if (qty <= 0) {
                // якщо ввели 0 чи менше — видаляємо позицію
                this._items = this._items.filter(i => i.id !== cartFigureId)
            } else {
                item.quantity = qty
            }
            this.saveGuestCart()
        } else {
            // для авторизованого
            if (qty <= 0) {
                // якщо вводять 0 — видаляємо на сервері
                await removeCartItemAPI(cartFigureId)
            } else {
                // інакше оновлюємо кількість
                await updateCartItemAPI(cartFigureId, qty)
            }
            // завантажуємо актуальний кошик
            await this.loadCart()
        }
    }

    async removeItem(cartFigureId) {
        if (this._isGuest) {
            this._items = this._items.filter(i => i.id !== cartFigureId);
            this.saveGuestCart();
        } else {
            await removeCartItemAPI(cartFigureId);
            runInAction(() => {
                this._items = this._items.filter(i => i.cartFigureId !== cartFigureId);
            });
        }
    }

    async clearCart() {
        if (this._isGuest) {
            this._items = [];
            localStorage.removeItem(GUEST_CART_KEY);
        } else {
            await clearCartAPI();
            runInAction(() => {this._items = []});
        }
    }

    // Гетери

    get items() {
        return this._items;
    }

    // Сума до сплати
    get total() {
        return this._items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    // Загальна кількість товарів у кошику
    get totalCount() {
        return this._items
            .filter(item => item && typeof item.quantity === 'number')
            .reduce((sum, item) => sum + item.quantity, 0);
    }
}
