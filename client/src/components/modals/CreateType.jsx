import React, {useState} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {createType} from "../../http/figureAPI.js";

const CreateType = ({show, onHide}) => {
    const [value, setValue] = useState("");
    const addType = () => {
        // Якщо запит успішний - обнуляємо інпут
        createType({name: value}).then(data => {
            setValue("");
            onHide();
        });
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Вкажіть назву типу</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        placeholder={"Введіть назву типу"}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрити
                </Button>
                <Button variant="outline-success" onClick={addType}>
                    Додати
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateType;