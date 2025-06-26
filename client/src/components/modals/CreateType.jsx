import React, {useContext, useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {createType} from "../../http/typeAPI.js";
import {Context} from "../../main.jsx";

const CreateType = ({show, onHide}) => {
    const {productStore} = useContext(Context);
    const [value, setValue] = useState("");

    const addType = async () => {
        if (!value.trim()) {
            return alert("Please enter a name for the type");
        }

        try {
            await createType({ name: value.trim() });
            // якщо успішно — оновлюємо стор і закриваємо модалку
            await productStore.fetchTypes();
            setValue("");
            onHide();
        } catch (err) {
            // показати другу, в чому проблема (400 → err.response.data.message)
            alert(err.response?.data?.message || "Error creating type");
        }
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