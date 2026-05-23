import React, {useContext, useEffect, useMemo, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {HOME_ROUTE, PRODUCT_ROUTE, ORDER_ROUTE} from "../utils/consts.js";
import {Button, Image, Modal} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";

const CartTable = observer(() => {
    const {cartStore} = useContext(Context);
    const [draftQty, setDraftQty] = useState({});
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

        return numberValue;
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

    const handleQuantityBlur = (item) => {
        const value = Number(draftQty[item.id]);
        const safe = Number.isFinite(value) && value > 0 ? value : 1;
        const prev = item.quantity;

        setDraftQty(prevState => ({
            ...prevState,
            [item.id]: safe
        }));

        if (safe === prev) return;

        const id = cartStore._isGuest ? item.id : item.cartProductId;
        cartStore.setQuantity(id, safe);
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

            <div className="cart__content">
                <div className="cart__items">
                    {cartStore.items.map((item) => {
                        const qty = getItemQty(item);
                        const itemTotal = Number(item.price || 0) * qty;

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
                                    <Form.Control
                                        id={`cart-qty-${item.id}`}
                                        type="number"
                                        min={1}
                                        value={draftQty[item.id] ?? item.quantity}
                                        onChange={e => {
                                            setDraftQty(prev => ({
                                                ...prev,
                                                [item.id]: e.target.value
                                            }));
                                        }}
                                        onBlur={() => handleQuantityBlur(item)}
                                    />
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