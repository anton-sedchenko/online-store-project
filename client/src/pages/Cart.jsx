import React from 'react';
import CartTable from "../components/CartTable.jsx";
import SideBar from "../components/SideBar.jsx";
import {Col, Row} from "react-bootstrap";
import {Helmet} from "react-helmet-async";

const Cart = () => {
    return (
        <div className="component__container">
            <Helmet>
                <title>Мій кошик – Charivna Craft</title>
                <meta
                    name="description"
                    content="Перевірте товари у своєму кошику перед оформленням замовлення."
                />
            </Helmet>

            <Row>
                <Col lg={2}>
                    <SideBar/>
                </Col>

                <Col lg={10}>
                    <CartTable/>
                </Col>
            </Row>
        </div>
    );
};

export default Cart;