import React, {useContext, useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {SHOP_ROUTE} from "../utils/consts.js";
import {useNavigate} from "react-router-dom";
import {createOrder} from "../http/orderAPI.js";
import {Context} from "../main.jsx";
import OrderConfirm from "../components/modals/OrderConfirm.jsx";
import {Helmet} from "react-helmet-async";

const Order = () => {
    const navigate = useNavigate();
    const {userStore, cartStore} = useContext(Context);
    const [showThankYou, setShowThankYou] = useState(false);

    const handleOrderConfirm = async (e) => {
        e.preventDefault();

        try {
            await createOrder({
                fullName: e.target.fullName.value,
                tel: e.target.tel.value,
                email: e.target.email.value,
                comments: e.target.comments.value,
                order: cartStore.items,
            }, userStore.isAuth);
        } catch {
            return alert("Не вдалося оформити замовлення");
        }
        
        setShowThankYou(true);
        setTimeout(() => {
            setShowThankYou(false);
            cartStore.clearCart();
            navigate(SHOP_ROUTE);
        }, 4000);
    }

    return (
        <>
            <Helmet>
                <title>Оформлення замовлення – Чарівна майстерня</title>
                <meta name="description"
                      content="Вкажіть дані для доставки й завершення замовлення виробів ручної роботи."/>
            </Helmet>

            <div className="component__container">
                <div className="order__form__container">
                    <h3 className="order__page__title">Оформлення замовлення</h3>
                    <form
                        className="buyer__contacts__form"
                        onSubmit={handleOrderConfirm}
                    >
                        <p>Прізвище ім'я по-батькові
                            <span className="input__label__required__marker">*</span>
                        </p>
                        <input
                            required
                            name="fullName"
                            type="text"
                            className="neu-input buyer__contacts__form-input"
                            maxLength="50"
                        />
                        <p>Телефон
                            <span className="input__label__required__marker">*</span>
                        </p>
                        <input
                            required
                            name="tel"
                            type="tel"
                            className="neu-input buyer__contacts__form-input"
                            maxLength="20"
                        />
                        <p>E-mail
                            <span className="input__label__required__marker">*</span>
                        </p>
                        <input
                            required
                            name="email"
                            type="email"
                            className="neu-input buyer__contacts__form-input"
                            maxLength="50"
                        />
                        <p>Коментар до замовлення</p>
                        <input
                            name="comments"
                            type="text"
                            className="neu-input buyer__contacts__form-input"
                            maxLength="200"
                        />
                        <div className="order__form__btn__container">
                            <button
                                className="neu-btn order__form__confirm__btn"
                                type="submit"
                            >
                                Підтвердити замовлення
                            </button>

                            <button
                                className="neu-btn order__form__return__btn"
                                type="button"
                                onClick={() => navigate(SHOP_ROUTE)}
                            >
                                Продовжити покупки
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <OrderConfirm
                show={showThankYou}
                onHide={() => setShowThankYou(false)}
            />
        </>
    );
};

export default Order;