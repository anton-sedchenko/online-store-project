import React, {useContext, useEffect, useState} from 'react';
import {Button, Dropdown, Form, Modal} from "react-bootstrap";
import {Context} from "../../main.jsx";
import {createFigure, fetchTypes} from "../../http/figureAPI.js";
import {observer} from "mobx-react-lite";

const CreateFigure = observer(({show, onHide}) => {
    const {figure} = useContext(Context);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [descr, setDescr] = useState('');
    const [file, setFile] = useState(null);
    const [code, setCode] = useState('');

    // Підгружаємо перелік типів
    useEffect(() => {
        fetchTypes().then(data => figure.setTypes(data));
    }, []);

    const selectFile = e => {
        setFile(e.target.files[0]);
    }

    const addFigure = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", `${price}`);
            formData.append("description", descr);
            formData.append("img", file);
            formData.append("typeId", figure.selectedType.id);
            formData.append("code", code);
            await createFigure(formData).then(data => onHide());
        } catch (e) {
            alert(e.response?.data?.message || e.message);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Вкажіть опис фігурки</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="modal__dropdown">
                        <Dropdown.Toggle>{figure.selectedType.name || "Обрати тип"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {figure.types.map((type) =>
                                <Dropdown.Item
                                    onClick={() => figure.setSelectedType(type)}
                                    key={type.id}
                                >
                                    {type.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        placeholder="Введіть назву фігурки"
                        className="modal__input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Form.Control
                        placeholder="Введіть код товару"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                    />
                    <Form.Control
                        placeholder="Введіть ціну фігурки"
                        type="number"
                        className="modal__input"
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                    />
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Додайте опис фігурки"
                        className="modal__input"
                        value={descr}
                        onChange={e => setDescr(e.target.value)}
                    />
                    <Form.Control
                        type="file"
                        className="modal__input"
                        onChange={selectFile}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрити
                </Button>
                <Button
                    variant="outline-success"
                    onClick={addFigure}
                >
                    Додати
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateFigure;