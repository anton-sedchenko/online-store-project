import React from "react";
import {Modal} from "react-bootstrap";

const AddedToCartModal = ({show, onHide}) => {
    return (
        <Modal
            centered
            show={show}
            onHide={onHide}
            className="added__to__cart__modal"
        >
            <Modal.Body closeButton>
                Товар додано до кошика 🛒
            </Modal.Body>
        </Modal>
    );
};

export default AddedToCartModal;