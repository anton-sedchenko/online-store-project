import React, {useContext, useState} from 'react';
import {Button, Col, Dropdown, Form, FormControl, Modal, Row} from "react-bootstrap";
import {Context} from "../../main.jsx";

const CreateFigure = ({show, onHide}) => {
    const {figure} = useContext(Context);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Вкажіть опис фігурки</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="modal__dropdown">
                        <Dropdown.Toggle>Обрати тип</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {figure.types.map((type) =>
                                <Dropdown.Item key={type.id}>{type.name}</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        placeholder="Введіть назву фігурки"
                        className="modal__input"
                    />
                    <Form.Control
                        placeholder="Введіть ціну фігурки"
                        type="number"
                        className="modal__input"
                    />
                    <Form.Control as="textarea" rows={4}
                          placeholder="Додайте опис фігурки"
                          className="modal__input"
                    />
                    <Form.Control
                        type="file"
                        className="modal__input"
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрити
                </Button>
                <Button variant="outline-success" onClick={onHide}>
                    Додати
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateFigure;