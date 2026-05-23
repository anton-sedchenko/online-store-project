import React from 'react';
import CartTable from "../components/CartTable.jsx";
import SideBar from "../components/SideBar.jsx";
import ProductsCounter from "../components/UI/ProductsCounter.jsx";
import {Col, Row} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import {Link} from "react-router-dom";
import {
    BLOG_ROUTE,
    CART_ROUTE,
    CONTACTS_ROUTE,
    HOME_ROUTE
} from "../utils/consts.js";

const Cart = () => {
    return (
        <div className="component__container cart__page">
            <Helmet>
                <title>Мій кошик – Charivna Craft</title>
                <meta
                    name="description"
                    content="Перевірте товари у своєму кошику перед оформленням замовлення."
                />
            </Helmet>

            <nav className="cart__page__quick-nav" aria-label="Швидка навігація">
                <Link to={HOME_ROUTE}>Каталог</Link>

                <Link to={CART_ROUTE} className="cart__page__quick-nav__cart">
                    <span>Мій кошик</span>
                    <ProductsCounter />
                </Link>

                <Link to={BLOG_ROUTE}>Блог</Link>
                <Link to={CONTACTS_ROUTE}>Контакти</Link>
            </nav>

            <Row className="cart__page__row">
                <Col xl={2} className="cart__page__sidebar">
                    <SideBar/>
                </Col>

                <Col xl={10} className="cart__page__content">
                    <CartTable/>
                </Col>
            </Row>
        </div>
    );
};

export default Cart;