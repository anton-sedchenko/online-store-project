import React, {useContext, useEffect, useMemo, useState, useRef} from "react";
import {HOME_ROUTE} from "../utils/consts.js";
import {useNavigate} from "react-router-dom";
import {createOrder} from "../http/orderAPI.js";
import {Context} from "../main.jsx";
import OrderConfirm from "../components/modals/OrderConfirm.jsx";
import {Helmet} from "react-helmet-async";
import {searchCities, getWarehouses} from "../http/npAPI.js";
import NPMapModal from "../components/modals/NPMapModal.jsx";

const Order = () => {
    const navigate = useNavigate();
    const {userStore, cartStore} = useContext(Context);
    const [showThankYou, setShowThankYou] = useState(false);

    const cartItems = Array.isArray(cartStore.items) ? cartStore.items : [];

    const orderTotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const qty = Number(item.quantity || item.qty || item.count || 1);
            const price = Number(item.price || 0);
            return sum + price * qty;
        }, 0);
    }, [cartItems]);

    const getItemQty = (item) => Number(item.quantity || item.qty || item.count || 1);

    // Спосіб доставки
    const [deliveryMethod, setDeliveryMethod] = useState("NP_BRANCH");

    // Міста НП
    const [cityQuery, setCityQuery] = useState("");
    const [cityOptions, setCityOptions] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);

    // Відділення/поштомати НП
    const [warehouses, setWarehouses] = useState([]);
    const [warehouseRef, setWarehouseRef] = useState("");

    const [warehouseSearch, setWarehouseSearch] = useState("");
    const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
    const warehouseInputRef = useRef(null);

    const [showMap, setShowMap] = useState(false);

    // Кур’єр НП
    const [crAddress, setCrAddress] = useState("");

    // Укрпошта
    const [ukrCity, setUkrCity] = useState("");
    const [ukrOffice, setUkrOffice] = useState("");

    const cityRef = selectedCity ? (selectedCity.DeliveryCity || selectedCity.Ref) : null;
    const cityLabel = selectedCity ? (selectedCity.Present || selectedCity.Description) : cityQuery;

    useEffect(() => {
        const t = setTimeout(async () => {
            if (!cityQuery.trim()) {
                setCityOptions([]);
                return;
            }

            try {
                const list = await searchCities(cityQuery.trim());
                setCityOptions(list);
            } catch {}
        }, 250);

        return () => clearTimeout(t);
    }, [cityQuery]);

    useEffect(() => {
        (async () => {
            setWarehouses([]);
            setWarehouseRef("");
            setWarehouseSearch("");
            setShowWarehouseDropdown(false);

            if (!deliveryMethod.startsWith("NP_")) return;
            if (!cityRef) return;

            try {
                const type = deliveryMethod === "NP_POSTOMAT" ? "Postomat" : "Branch";
                const list = await getWarehouses({cityRef, type});
                setWarehouses(list);
            } catch {}
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity, deliveryMethod]);

    useEffect(() => {
        if (
            warehouses.length > 0 &&
            document.activeElement === warehouseInputRef.current
        ) {
            setShowWarehouseDropdown(true);
        }
    }, [warehouses]);

    const selectedWarehouse = useMemo(
        () => warehouses.find(w => w.Ref === warehouseRef) || null,
        [warehouses, warehouseRef]
    );

    const filteredWarehouses = useMemo(() => {
        if (!warehouseSearch.trim()) return warehouses;

        const q = warehouseSearch.trim().toLowerCase();

        return warehouses.filter(w => {
            const label = `${w.Number ? `№${w.Number} — ` : ""}${w.Description}`;
            return label.toLowerCase().includes(q);
        });
    }, [warehouseSearch, warehouses]);

    const warehouseInputValue = warehouseSearch !== ""
        ? warehouseSearch
        : (selectedWarehouse
            ? `${selectedWarehouse.Number ? `№${selectedWarehouse.Number} — ` : ""}${selectedWarehouse.Description}`
            : "");

    const handleOrderConfirm = async (e) => {
        e.preventDefault();

        if (!cartItems.length) {
            return alert("Ваш кошик порожній. Додайте товар перед оформленням замовлення.");
        }

        if (deliveryMethod.startsWith("NP_") && !cityRef) {
            return alert("Оберіть місто доставки Нової Пошти");
        }

        if ((deliveryMethod === "NP_BRANCH" || deliveryMethod === "NP_POSTOMAT") && !warehouseRef) {
            return alert("Оберіть відділення/поштомат Нової Пошти");
        }

        if (deliveryMethod === "NP_COURIER" && (!cityRef || !crAddress.trim())) {
            return alert("Для курʼєрської доставки вкажіть місто і повну адресу (вулиця, будинок, квартира).");
        }

        if (deliveryMethod === "UKR_BRANCH" && (!ukrCity.trim() || !ukrOffice.trim())) {
            return alert("Вкажіть місто та відділення Укрпошти");
        }

        let shipping = null;

        if (deliveryMethod.startsWith("NP_")) {
            const selectedW = warehouses.find(w => w.Ref === warehouseRef);
            const isPostomat = deliveryMethod === "NP_POSTOMAT";

            const map = selectedW ? {
                address: selectedW.ShortAddress || selectedW.Description,
                lat: Number(selectedW.Latitude) || undefined,
                lng: Number(selectedW.Longitude) || undefined,
            } : undefined;

            if (deliveryMethod === "NP_COURIER") {
                shipping = {
                    method: "Нова Пошта",
                    service: "Нова Пошта",
                    city: selectedCity ? {name: cityLabel, ref: cityRef} : undefined,
                    address: crAddress.trim(),
                };
            } else {
                shipping = {
                    method: "Нова Пошта",
                    service: "Нова Пошта",
                    city: selectedCity ? {name: cityLabel, ref: cityRef} : undefined,
                    branch: (!isPostomat && selectedW) ? {
                        ref: selectedW.Ref,
                        description: selectedW.Description,
                        number: selectedW.Number,
                    } : undefined,
                    postomat: (isPostomat && selectedW) ? {
                        ref: selectedW.Ref,
                        description: selectedW.Description,
                        number: selectedW.Number,
                    } : undefined,
                    map,
                };
            }
        } else if (deliveryMethod === "UKR_BRANCH") {
            shipping = {
                method: "Укрпошта",
                service: "Укрпошта",
                city: {name: ukrCity.trim()},
                address: ukrOffice.trim(),
            };
        }

        try {
            const form = e.target;

            const firstName = form.elements.firstName.value.trim();
            const lastName = form.elements.lastName.value.trim();
            const fullName = `${firstName} ${lastName}`.trim();

            await createOrder({
                fullName,
                tel: form.tel.value,
                email: form.email.value,
                comments: form.comments.value,
                order: cartStore.items,
                shipping,
            }, userStore.isAuth);
        } catch {
            return alert("Не вдалося оформити замовлення");
        }

        setShowThankYou(true);

        setTimeout(() => {
            setShowThankYou(false);
            cartStore.clearCart();
            navigate(HOME_ROUTE);
        }, 4500);
    };

    return (
        <>
            <Helmet>
                <title>Оформлення замовлення – Charivna Craft</title>
                <meta
                    name="description"
                    content="Вкажіть дані для доставки й завершення замовлення виробів ручної роботи."
                />
            </Helmet>

            <div className="component__container">
                <div className="order__form__container">
                    <h3 className="order__page__title">Оформлення замовлення</h3>

                    <div className="order__summary__card">
                        <div className="order__summary__header">
                            <h4>Ваше замовлення</h4>
                            <span>{cartItems.length} товар(и)</span>
                        </div>

                        {cartItems.length > 0 ? (
                            <>
                                <div className="order__summary__items">
                                    {cartItems.map((item) => {
                                        const qty = getItemQty(item);
                                        const price = Number(item.price || 0);

                                        return (
                                            <div className="order__summary__item" key={item.id}>
                                                {item.img && (
                                                    <img
                                                        src={item.img}
                                                        alt={item.name}
                                                        className="order__summary__img"
                                                    />
                                                )}

                                                <div className="order__summary__info">
                                                    <p>{item.name}</p>
                                                    <span>{qty} шт. × {price} грн</span>
                                                </div>

                                                <strong>{qty * price} грн</strong>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="order__summary__total">
                                    <span>Разом до оплати:</span>
                                    <strong>{orderTotal} грн</strong>
                                </div>
                            </>
                        ) : (
                            <p className="order__summary__empty">
                                Ваш кошик порожній. Поверніться до каталогу й додайте товар.
                            </p>
                        )}
                    </div>

                    <form className="buyer__contacts__form" onSubmit={handleOrderConfirm}>
                        <div className="order__section__card">
                            <h4>Контактні дані</h4>

                            <div className="buyer__name__info__container">
                                <div>
                                    <p>Ім'я<span className="input__label__required__marker">*</span></p>
                                    <input required name="firstName" type="text" className="buyer__contacts__form-input" maxLength="50" />
                                </div>

                                <div>
                                    <p>Прізвище<span className="input__label__required__marker">*</span></p>
                                    <input required name="lastName" type="text" className="buyer__contacts__form-input" maxLength="50" />
                                </div>
                            </div>

                            <div className="buyer__contacts__info__container">
                                <div>
                                    <p>Телефон<span className="input__label__required__marker">*</span></p>
                                    <input required name="tel" type="tel" className="buyer__contacts__form-input" maxLength="20" />
                                </div>

                                <div>
                                    <p>E-mail<span className="input__label__required__marker">*</span></p>
                                    <input required name="email" type="email" className="buyer__contacts__form-input" maxLength="50" />
                                </div>
                            </div>
                        </div>

                        <div className="order__section__card">
                            <h4>Доставка</h4>
                            <p className="order__section__hint">
                                Виберіть зручний спосіб доставки. Вартість доставки оплачується за тарифами перевізника.
                            </p>

                            <div className="shipping__methods">
                                <label className={`radio shipping__method ${deliveryMethod === "NP_BRANCH" ? "active" : ""}`}>
                                    <input type="radio" checked={deliveryMethod === "NP_BRANCH"} onChange={() => setDeliveryMethod("NP_BRANCH")} />
                                    <span>
                                        <strong>Нова пошта — відділення</strong>
                                        <small>Самовивіз з обраного відділення</small>
                                    </span>
                                </label>

                                <label className={`radio shipping__method ${deliveryMethod === "NP_POSTOMAT" ? "active" : ""}`}>
                                    <input type="radio" checked={deliveryMethod === "NP_POSTOMAT"} onChange={() => setDeliveryMethod("NP_POSTOMAT")} />
                                    <span>
                                        <strong>Нова пошта — поштомат</strong>
                                        <small>Зручно для швидкого отримання</small>
                                    </span>
                                </label>

                                <label className={`radio shipping__method ${deliveryMethod === "NP_COURIER" ? "active" : ""}`}>
                                    <input type="radio" checked={deliveryMethod === "NP_COURIER"} onChange={() => setDeliveryMethod("NP_COURIER")} />
                                    <span>
                                        <strong>Курʼєр Нова пошта</strong>
                                        <small>Доставка за адресою</small>
                                    </span>
                                </label>

                                <label className={`radio shipping__method ${deliveryMethod === "UKR_BRANCH" ? "active" : ""}`}>
                                    <input type="radio" checked={deliveryMethod === "UKR_BRANCH"} onChange={() => setDeliveryMethod("UKR_BRANCH")} />
                                    <span>
                                        <strong>Укрпошта — відділення</strong>
                                        <small>Самовивіз з відділення Укрпошти</small>
                                    </span>
                                </label>
                            </div>

                            {deliveryMethod.startsWith("NP_") && (
                                <>
                                    <p style={{marginTop: 12}}>Місто</p>
                                    <input
                                        type="text"
                                        className="buyer__contacts__form-input"
                                        placeholder="Почніть вводити місто…"
                                        value={cityLabel}
                                        onChange={(e) => {
                                            setSelectedCity(null);
                                            setCityQuery(e.target.value);
                                        }}
                                    />

                                    {(!selectedCity && cityOptions.length > 0) && (
                                        <div className="dropdown-list">
                                            {cityOptions.map(c => (
                                                <div
                                                    key={c.DeliveryCity || c.Ref}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setSelectedCity(c);
                                                        setCityOptions([]);
                                                    }}
                                                >
                                                    {c.Present || c.Description}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {deliveryMethod === "NP_COURIER" && selectedCity && (
                                        <>
                                            <p style={{marginTop: 12}}>Адреса доставки</p>
                                            <input
                                                className="buyer__contacts__form-input"
                                                value={crAddress}
                                                onChange={e => setCrAddress(e.target.value)}
                                                placeholder="Напр.: вул. Шевченка, 10, кв. 25"
                                                maxLength={120}
                                            />
                                        </>
                                    )}

                                    {(deliveryMethod === "NP_BRANCH" || deliveryMethod === "NP_POSTOMAT") && selectedCity && (
                                        <>
                                            <p style={{marginTop: 12}}>Відділення / Поштомат</p>

                                            <div className="post__warhouse__pick__container">
                                                <div className="post__warhouse__list__container">
                                                    <input
                                                        ref={warehouseInputRef}
                                                        type="text"
                                                        name="fake-warehouse"
                                                        className="buyer__contacts__form-input"
                                                        inputMode="none"
                                                        placeholder="Почніть вводити номер або адресу відділення…"
                                                        autoComplete="new-password"
                                                        spellCheck="false"
                                                        autoCorrect="off"
                                                        autoCapitalize="off"
                                                        value={warehouseInputValue}
                                                        onChange={(e) => {
                                                            setWarehouseSearch(e.target.value);
                                                            setWarehouseRef("");
                                                            setShowWarehouseDropdown(true);
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.readOnly = true;
                                                            setTimeout(() => {
                                                                e.target.readOnly = false;
                                                            }, 100);
                                                            if (warehouses.length) setShowWarehouseDropdown(true);
                                                        }}
                                                        onClick={() => {
                                                            if (warehouses.length) setShowWarehouseDropdown(true);
                                                        }}
                                                        onBlur={() => {
                                                            setTimeout(() => setShowWarehouseDropdown(false), 150);
                                                        }}
                                                    />

                                                    {showWarehouseDropdown && filteredWarehouses.length > 0 && (
                                                        <div
                                                            className="dropdown-list"
                                                            style={{
                                                                position: "absolute",
                                                                top: "100%",
                                                                left: 0,
                                                                right: 0,
                                                                marginTop: 4,
                                                                maxHeight: "260px",
                                                                overflowY: "auto",
                                                                zIndex: 20
                                                            }}
                                                        >
                                                            {filteredWarehouses.map(w => {
                                                                const label = `${w.Number ? `№${w.Number} — ` : ""}${w.Description}`;

                                                                return (
                                                                    <div
                                                                        key={w.Ref}
                                                                        className="dropdown-item"
                                                                        onMouseDown={() => {
                                                                            setWarehouseRef(w.Ref);
                                                                            setWarehouseSearch("");
                                                                            setShowWarehouseDropdown(false);
                                                                        }}
                                                                    >
                                                                        {label}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {showWarehouseDropdown && filteredWarehouses.length === 0 && (
                                                        <div
                                                            className="dropdown-list"
                                                            style={{
                                                                position: "absolute",
                                                                top: "100%",
                                                                left: 0,
                                                                right: 0,
                                                                marginTop: 4,
                                                                maxHeight: "200px",
                                                                overflowY: "auto",
                                                                zIndex: 20
                                                            }}
                                                        >
                                                            <div className="dropdown-item muted">
                                                                Нічого не знайдено
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{display: "flex", gap: 8}}>
                                                    <button
                                                        type="button"
                                                        className="neu-btn"
                                                        onClick={() => setShowMap(true)}
                                                        disabled={!cityRef}
                                                    >
                                                        Обрати на мапі
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            {deliveryMethod === "UKR_BRANCH" && (
                                <>
                                    <p style={{marginTop: 12}}>Місто</p>
                                    <input
                                        className="buyer__contacts__form-input"
                                        value={ukrCity}
                                        onChange={e => setUkrCity(e.target.value)}
                                        placeholder="Вкажіть місто доставки"
                                    />

                                    <p style={{marginTop: 12}}>Відділення Укрпошти</p>
                                    <input
                                        className="buyer__contacts__form-input"
                                        value={ukrOffice}
                                        onChange={e => setUkrOffice(e.target.value)}
                                        placeholder="Вкажіть номер або адресу відділення"
                                    />
                                </>
                            )}
                        </div>

                        <div className="order__section__card">
                            <h4>Коментар до замовлення</h4>
                            <p className="order__section__hint">
                                Можете вказати побажання щодо кольору, пакування, часу дзвінка або інші деталі.
                            </p>

                            <textarea
                                name="comments"
                                className="buyer__contacts__form-input order__comments__textarea"
                                maxLength="200"
                            />
                        </div>

                        <div className="order__next__steps">
                            <strong>Що буде після оформлення?</strong>
                            <p>
                                Ми отримаємо ваше замовлення, перевіримо деталі та звʼяжемося з вами для підтвердження.
                            </p>
                        </div>

                        <div className="order__form__btn__container">
                            <button className="order__form__confirm__btn" type="submit">
                                Підтвердити замовлення
                            </button>

                            <button
                                className="order__form__return__btn"
                                type="button"
                                onClick={() => navigate(HOME_ROUTE)}
                            >
                                Повернутись до каталогу
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <NPMapModal
                show={showMap}
                onHide={() => setShowMap(false)}
                cityRef={cityRef}
                type={deliveryMethod === "NP_POSTOMAT" ? "Postomat" : "Branch"}
                onSelect={w => setWarehouseRef(w.Ref)}
            />

            <OrderConfirm show={showThankYou} onHide={() => setShowThankYou(false)} />
        </>
    );
};

export default Order;