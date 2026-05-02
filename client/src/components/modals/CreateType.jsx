import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createType} from "../../http/typeAPI.js";

const CreateType = ({show, onHide}) => {
    const [name, setName] = useState('');

    const resetForm = () => {
        setName('');
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            alert('Введіть назву категорії');
            return;
        }

        try {
            await createType({name: name.trim()});
            resetForm();
            onHide();
        } catch (e) {
            alert(e.response?.data?.message || e.message);
        }
    };

    const handleClose = () => {
        resetForm();
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Додати категорію</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Назва категорії</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Наприклад: Кошики для ванної"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>
                    Закрити
                </Button>
                <Button variant="outline-success" onClick={handleCreate}>
                    Додати
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateType;