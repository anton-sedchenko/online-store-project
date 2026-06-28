import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {HOME_ROUTE, PRODUCT_ROUTE, ORDER_ROUTE} from "../utils/consts.js";
import {Button, Image, Modal} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";

const normalizeQuantity = (value) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue) || numericValue < 1) {
        return 1;
    }

    return Math.floor(numericValue);
};

const CartTable = observer(() => {
    const {cartStore} = useContext(Context);
    const [draftQty, setDraftQty] = useState({});
    const [updatingItemIds, setUpdatingItemIds] = useState(() => new Set());
    const updatingItemIdsRef = useRef(new Set());
    const [quantityError, setQuantityError] = useState('');
    const [showMinModal, setShowMinModal] = useState(false);
    const navigate = useNavigate();

    const MIN_ORDER = 250;

    useEffect(() => {
        const map = {};
        cartStore.items.forEach(i => {
            map[i.id] = i.quantity;
        });
        setDraftQty(map);
    }, [cartStore.items]);

    const getItemQty = (item) => {
        const value = draftQty[item.id] ?? item.quantity;
        const numberValue = Number(value);

        if (!Number.isFinite(numberValue) || numberValue < 1) {
            return 1;
        }

        return Math.floor(numberValue);
    };

    const total = useMemo(() => {
        return cartStore.items.reduce((sum, item) => {
            return sum + Number(item.price || 0) * getItemQty(item);
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartStore.items, draftQty]);

    const totalQty = useMemo(() => {
        return cartStore.items.reduce((sum, item) => {
            return sum + getItemQty(item);
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartStore.items, draftQty]);

    const commitQuantity = async (item, value) => {
        const safe = normalizeQuantity(value);
        const currentQuantity = normalizeQuantity(item.quantity);
        const itemKey = item.id;

        if (!cartStore._isGuest && updatingItemIdsRef.current.has(itemKey)) return;

        setDraftQty(prevState => ({
            ...prevState,
            [itemKey]: safe
        }));

        if (safe === currentQuantity) return;

        const id = cartStore._isGuest ? item.id : item.cartProductId;

        setQuantityError('');
        updatingItemIdsRef.current.add(itemKey);
        setUpdatingItemIds(prevState => new Set(prevState).add(itemKey));

        try {
            await cartStore.setQuantity(id, safe);
        } catch (error) {
            console.error('Не вдалося змінити кількість товару', error);
            setDraftQty(prevState => ({
                ...prevState,
                [itemKey]: currentQuantity
            }));
            setQuantityError('Не вдалося змінити кількість товару');
        } finally {
            updatingItemIdsRef.current.delete(itemKey);
            setUpdatingItemIds(prevState => {
                const nextState = new Set(prevState);
                nextState.delete(itemKey);
                return nextState;
            });
        }
    };

    const handleQuantityBlur = (item) => {
        commitQuantity(item, draftQty[item.id]);
    };

    const handleQuantityKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.currentTarget.blur();
        }
    };

    const handleRemove = (item) => {
        const id = cartStore._isGuest ? item.id : item.cartProductId;
        cartStore.removeItem(id);
    };

    const handleOrder = () => {
        if (total < MIN_ORDER) {
            setShowMinModal(true);
            return;
        }

        navigate(ORDER_ROUTE);
    };

    if (cartStore.items.length === 0) {
        return (
            <div className="cart__table__container">
                <div className="cart__empty__card">
                    <h2>Ваш кошик порожній</h2>
                    <p>
                        Додайте вироби до кошика, а потім поверніться сюди для оформлення замовлення.
                    </p>

                    <button
                        type="button"
                        className="cart__table__confirm__btn"
                        onClick={() => navigate(HOME_ROUTE)}
                    >
                        Перейти до каталогу
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart__table__container">
            <div className="cart__header">
                <div>
                    <h2>Ваш кошик</h2>
                    <p>Перевірте товари, кількість і суму перед оформленням замовлення.</p>
                </div>
            </div>

            {quantityError && (
                <div className="cart__quantity__error" role="alert">
                    {quantityError}
                </div>
            )}

            <div className="cart__content">
                <div className="cart__items">
                    {cartStore.items.map((item) => {
                        const qty = getItemQty(item);
                        const itemTotal = Number(item.price || 0) * qty;
                        const isUpdating = updatingItemIds.has(item.id);

                        return (
                            <div className="cart__item" key={item.id}>
                                <Link
                                    to={`${PRODUCT_ROUTE}/${item.slug}`}
                                    className="cart__item__image-link"
                                    aria-label={`Перейти до товару ${item.name}`}
                                >
                                    <Image
                                        src={item.img}
                                        width={82}
                                        height={82}
                                        className="cart__item__image"
                                        alt={item.name}
                                    />
                                </Link>

                                <div className="cart__item__info">
                                    <Link
                                        to={`${PRODUCT_ROUTE}/${item.slug}`}
                                        className="cart__item__title"
                                    >
                                        {item.name}
                                    </Link>

                                    <div className="cart__item__meta">
                                        <span>Ціна: {item.price} грн</span>
                                        <span>Сума: {itemTotal} грн</span>
                                    </div>
                                </div>

                                <div className="cart__item__quantity">
                                    <label htmlFor={`cart-qty-${item.id}`}>Кількість</label>
                                    <div className="cart__quantity__stepper">
                                        <button
                                            type="button"
                                            className="cart__quantity__button"
                                            aria-label={`Зменшити кількість товару ${item.name}`}
                                            onClick={() => commitQuantity(item, qty - 1)}
                                            disabled={qty <= 1 || isUpdating}
                                        >
                                            −
                                        </button>
                                        <input
                                            id={`cart-qty-${item.id}`}
                                            className="cart__quantity__input"
                                            type="number"
                                            min={1}
                                            step={1}
                                            inputMode="numeric"
                                            value={draftQty[item.id] ?? item.quantity}
                                            aria-label={`Кількість товару ${item.name}`}
                                            disabled={isUpdating}
                                            onChange={e => {
                                                setDraftQty(prev => ({
                                                    ...prev,
                                                    [item.id]: e.target.value
                                                }));
                                            }}
                                            onBlur={() => handleQuantityBlur(item)}
                                            onKeyDown={handleQuantityKeyDown}
                                            onWheel={(e) => e.currentTarget.blur()}
                                        />
                                        <button
                                            type="button"
                                            className="cart__quantity__button"
                                            aria-label={`Збільшити кількість товару ${item.name}`}
                                            onClick={() => commitQuantity(item, qty + 1)}
                                            disabled={isUpdating}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="cart__item__sum">
                                    <span>До оплати</span>
                                    <strong>{itemTotal} грн</strong>
                                </div>

                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="cart__item__remove"
                                    onClick={() => handleRemove(item)}
                                    aria-label={`Видалити товар ${item.name} з кошика`}
                                >
                                    ×
                                </Button>
                            </div>
                        );
                    })}
                </div>

                <aside className="cart__summary">
                    <h3>Підсумок</h3>

                    <div className="cart__summary__row">
                        <span>Позицій у кошику:</span>
                        <strong>{cartStore.items.length}</strong>
                    </div>

                    <div className="cart__summary__row">
                        <span>Усього одиниць:</span>
                        <strong>{totalQty}</strong>
                    </div>

                    <div className="cart__summary__total">
                        <span>Разом до оплати:</span>
                        <strong>{total} грн</strong>
                    </div>

                    <button
                        type="button"
                        className="cart__table__confirm__btn"
                        onClick={handleOrder}
                    >
                        Оформити замовлення
                    </button>

                    <button
                        type="button"
                        className="cart__continue__btn"
                        onClick={() => navigate(HOME_ROUTE)}
                    >
                        Продовжити покупки
                    </button>
                </aside>
            </div>

            <Modal show={showMinModal} onHide={() => setShowMinModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Мінімальна сума замовлення</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Мінімальна сума замовлення — {MIN_ORDER} грн.
                    У вашому кошику зараз {total} грн. Можна збільшити кількість товару або додати ще один виріб.
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMinModal(false)}>
                        Закрити
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowMinModal(false);
                            navigate(HOME_ROUTE);
                        }}
                    >
                        Додати ще товари
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default CartTable;