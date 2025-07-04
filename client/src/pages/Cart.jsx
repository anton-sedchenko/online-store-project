import React from 'react';
import CartTable from "../components/CartTable.jsx";
import SideBar from "../components/SideBar.jsx";
import {Col, Container, Row} from "react-bootstrap";

const Cart = () => {
    return (
        <div className="component__container">
            <Row>
                <Col md={2}>
                    <SideBar/>
                </Col>
                <Col md={9}>
                    <CartTable/>
                </Col>
            </Row>
        </div>
    );
};

export default Cart;
