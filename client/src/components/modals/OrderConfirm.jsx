import React from 'react';
import {Modal} from "react-bootstrap";

const OrderConfirm = ({show, onHide}) => {
    return (
        <Modal
            centered
            show={show}
            onHide={() => onHide(false)}
        >
            <Modal.Header>
                <Modal.Title>Замовлення оформлене!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Дякуємо за покупку! Наш менеджер зв'яжеться з вами найближчим часом.
            </Modal.Body>
        </Modal>
    );
};

export default OrderConfirm;