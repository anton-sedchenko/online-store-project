import React, { useContext } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../../main.jsx";

const MobileTypeModal = observer(({ show, onHide }) => {
    const { productStore } = useContext(Context);

    const resetFilter = () => {
        productStore.setSelectedType({});
        onHide(); // якщо хочеш одразу закривати модалку
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Оберіть тип товару</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {productStore.types.map((type) => (
                        <ListGroup.Item
                            key={type.id}
                            active={type.id === productStore.selectedType.id}
                            onClick={() => {
                                productStore.setSelectedType(type);
                                onHide(); // можна прибрати, якщо хочеш залишити відкритою
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            {type.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={resetFilter}>
                    Скинути фільтр
                </Button>
                <Button variant="outline-dark" onClick={onHide}>
                    Закрити
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default MobileTypeModal;