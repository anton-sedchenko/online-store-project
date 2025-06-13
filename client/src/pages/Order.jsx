import React, {useContext, useState} from 'react';
import SideBar from "../components/SideBar.jsx";
import {Button, Col, Container, Row} from "react-bootstrap";
import {SHOP_ROUTE} from "../utils/consts.js";
import {useNavigate} from "react-router-dom";
import {createOrder, createOrderGuest} from "../http/orderAPI.js";
import {Context} from "../main.jsx";
import OrderConfirm from "../components/modals/OrderConfirm.jsx";

const Order = () => {
    const navigate = useNavigate();
    const {cart, user} = useContext(Context);
    const [showThankYou, setShowThankYou] = useState(false);

    const handleOrderConfirm = async (e) => {
        e.preventDefault();

        const payload = {
            fullName: e.target.fullName.value,
            tel: e.target.tel.value,
            email: e.target.email.value,
            comments: e.target.comments.value,
            order: cart.items,
        };

        try {
            if (user.isAuth) {
                // якщо залогінений — токен в $authHost
                await createOrder(payload);
            } else {
                // якщо гість — без токена
                await createOrderGuest(payload);
            }
        } catch (err) {
            return alert("Не вдалося оформити замовлення");
        }
        
        setShowThankYou(true);
        setTimeout(() => {
            setShowThankYou(false);
            navigate(SHOP_ROUTE);
        }, 4000);
    }

    return (
        <>
            <SideBar/>
            <Container>
                <Row>
                    <Col md={6}>
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
                                className="buyer__contacts__form-input"
                                maxLength="50"
                            />
                            <p>Телефон
                                <span className="input__label__required__marker">*</span>
                            </p>
                            <input
                                required
                                name="tel"
                                type="tel"
                                className="buyer__contacts__form-input"
                                maxLength="20"
                            />
                            <p>E-mail
                                <span className="input__label__required__marker">*</span>
                            </p>
                            <input
                                required
                                name="email"
                                type="email"
                                className="buyer__contacts__form-input"
                                maxLength="50"
                            />
                            <p>Коментар до замовлення</p>
                            <input
                                name="comments"
                                type="text"
                                className="buyer__contacts__form-input"
                                maxLength="200"
                            />
                            <div className="order__form__btn__container">
                                <Button
                                    variant="outline-secondary"
                                    type="button"
                                    onClick={() => navigate(SHOP_ROUTE)}
                                >
                                    Продовжити покупки
                                </Button>

                                <Button
                                    variant="outline-success"
                                    type="submit"
                                >
                                    Підтвердити замовлення
                                </Button>
                            </div>
                        </form>
                    </Col>
                    <Col md={6}>
                        <div>
                            <h3>Доставка і оплата</h3>
                            <p>- Сума мінімального замовлення у нашому інтернет-магазині - 250 грн.</p>
                            <p>- Усі замовлення обробляються протягом двох робочих днів після їх оформлення.</p>
                            <h3>Способи оплати</h3>
                            <p>- На картку ПриватБанку. Реквізити надсилає менеджер після обробки замовлення.</p>
                            <p>- При отриманні свого замовлення у відділенні Нова Пошта.
                                Комісію за переказ коштів сплачує Покупець.</p>
                            <h4>Способи доставки в межах України:</h4>
                            <p>- Усі замовлення ми відправляємо в межах України, за винятком тимчасово окупованих
                                територій України та АР Крим.</p>
                            <p>- Перевірку замовлення на предмет цілісності упаковки і відсутності зовнішніх пошкоджень
                                товару обов'язково здійснювати на місці - у відділенні служби доставки. При наявності
                                пошкодження товару під час перевезення вимагайте від працівників служби доставки скласти
                                акт із зазначенням характеру пошкодження товару і повідомте про це нам!</p>
                            <p>- Якщо ви замовили доставку в поштомат, перевірку замовлення на предмет цілісності
                                упаковки і відсутності зовнішніх пошкоджень товару теж обов'язково здійснювати на місці
                                - при виявленні пошкоджень клієнт може оформити претензію:
                                1) у будь-якому відділенні, де йому допоможуть заповнити спеціальний бланк;
                                2) зателефонувавши до контакт-центру за номером 0 800 500 609.
                                Термін розгляду компенсації – до 3 днів з моменту запиту.</p>
                            <p><a href="https://novaposhta.ua/poshtomat/#faq">
                                https://novaposhta.ua/poshtomat/#faq</a>
                            </p>
                            <p>Зверніть увагу! При доставці до складу транспортної компанії, замовлення зберігається
                                на складі не більше 5 робочих днів, після чого повертається назад!</p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <OrderConfirm
                show={showThankYou}
                onHide={() => setShowThankYou(false)}
            />
        </>
    );
};

export default Order;