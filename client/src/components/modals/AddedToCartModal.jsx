import React from "react";
import {Modal} from "react-bootstrap";

const AddedToCartModal = ({show, onHide}) => {
    return (
        <Modal
            centered
            show={show}
            onHide={onHide}
        >
            <Modal.Body
                closeButton
                className="added__to__cart__modal"
            >
                Товар додано до кошика 🛒
            </Modal.Body>
        </Modal>
    );
};

export default AddedToCartModal;