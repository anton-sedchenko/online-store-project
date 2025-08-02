import React, {useContext} from "react";
import {Modal, Button, ListGroup} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../../main.jsx";

const MobileTypeModal = observer(({ show, onHide }) => {
    const {productStore} = useContext(Context);

    const resetFilter = () => {
        productStore.setSelectedType({});
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Оберіть тип товару</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {Array.isArray(productStore.types) &&
                        productStore.types
                            .filter(t => t && t.name)
                            .map((type) => (
                                <ListGroup.Item
                                    key={type.id}
                                    active={type.id === productStore.selectedType.id}
                                    onClick={() => {
                                        productStore.setSelectedType(type);
                                        onHide();
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