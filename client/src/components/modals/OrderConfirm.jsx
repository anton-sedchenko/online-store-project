import React from 'react';
import {Modal} from "react-bootstrap";

const OrderConfirm = ({show, onHide, skipConfirmationContact = false}) => {
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
                {skipConfirmationContact
                    ? "Дякуємо за покупку! Замовлення передано в роботу без додаткового підтвердження. Зв’яжемося лише за потреби уточнити дані."
                    : "Дякуємо за покупку! Наш менеджер зв'яжеться з вами найближчим часом."}
            </Modal.Body>
        </Modal>
    );
};

export default OrderConfirm;