import React from 'react';
import CartTable from "../components/CartTable.jsx";
import SideBar from "../components/SideBar.jsx";
import {Col, Row} from "react-bootstrap";
import {Helmet} from "react-helmet-async";

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

            <Row>
                <Col xl={2} className="cart__page__sidebar">
                    <SideBar/>
                </Col>

                <Col xl={10}>
                    <CartTable/>
                </Col>
            </Row>
        </div>
    );
};

export default Cart;