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

            if (!Array.isArray(raw)) {
                console.error("❌ Очікував масив товарів, отримав:", raw);
                return;
            }

            const items = raw.map(ci => ({
                cartProductId: ci.id,
                productId: ci.productId,
                id: ci.product.id,
                name: ci.product.name,
                price: ci.product.price,
                img: ci.product.img,
                slug: ci.product.slug,
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

                console.log("Додаємо в гостьовий кошик:", product);

                this._items.push({ ...product, quantity: qty });
            }
            this.saveGuestCart();
        } else {
            // Авторизований
            await addToCartAPI(product.id, qty);
            await this.loadCart();
        }
    }

    async setQuantity(cartProductId, qty) {
        if (this._isGuest) {
            // гостьова логіка зміни кількості товару
            const item = this._items.find(i => i.id === cartProductId)
            if (!item) return
            if (qty <= 0) {
                // якщо ввели 0 чи менше — видаляємо позицію
                this._items = this._items.filter(i => i.id !== cartProductId)
            } else {
                item.quantity = qty
            }
            this.saveGuestCart()
        } else {
            // для авторизованого
            if (qty <= 0) {
                // якщо вводять 0 — видаляємо на сервері
                await removeCartItemAPI(cartProductId)
            } else {
                // інакше оновлюємо кількість
                await updateCartItemAPI(cartProductId, qty)
            }
            // завантажуємо актуальний кошик
            await this.loadCart()
        }
    }

    async removeItem(cartProductId) {
        if (this._isGuest) {
            this._items = this._items.filter(i => i.id !== cartProductId);
            this.saveGuestCart();
        } else {
            await removeCartItemAPI(cartProductId);
            runInAction(() => {
                this._items = this._items.filter(i => i.cartProductId !== cartProductId);
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
