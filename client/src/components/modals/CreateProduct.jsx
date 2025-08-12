import React, {useContext, useEffect, useState} from 'react';
import {Button, Dropdown, Form, Modal} from "react-bootstrap";
import {Context} from "../../main.jsx";
import {createProduct} from "../../http/productAPI.js";
import {fetchTypes} from "../../http/typeAPI.js";
import {observer} from "mobx-react-lite";

const CreateProduct = observer(({show, onHide}) => {
    const {productStore} = useContext(Context);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [descr, setDescr] = useState('');
    const [file, setFile] = useState(null);
    const [code, setCode] = useState('');
    const [availability, setAvailability] = useState('IN_STOCK');

    // Підгружаємо перелік типів
    useEffect(() => {
        fetchTypes().then(data => productStore.setTypes(data));
    }, []);

    const selectFile = e => {
        setFile(e.target.files[0]);
    }

    const addProduct = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", `${price}`);
            formData.append("description", descr || "");
            formData.append("img", file);
            formData.append("typeId", productStore.selectedType.id);
            formData.append("code", code);
            formData.append('availability', availability);
            await createProduct(formData).then(() => onHide());
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
                        <Dropdown.Toggle>{productStore.selectedType.name || "Обрати тип"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Array.isArray(productStore.types) &&
                                productStore.types
                                    .filter(t => t && t.name)
                                    .map((type) =>
                                        <Dropdown.Item
                                            onClick={() => productStore.setSelectedType(type)}
                                            key={type.id}
                                        >
                                            {type.name}
                                        </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        placeholder="Назва товару"
                        className="modal__input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Form.Control
                        placeholder="Код товару"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                    />
                    <Form.Group className="mb-2">
                        <Form.Select
                            placeholder="Наявність товару"
                            value={availability}
                            onChange={e => setAvailability(e.target.value)}
                        >
                            <option value="IN_STOCK">В наявності</option>
                            <option value="PRE_ORDER">Під замовлення (2–3 дні)</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Control
                        placeholder="Ціна товару"
                        type="number"
                        className="modal__input"
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                    />
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Опис товару"
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
                    onClick={addProduct}
                >
                    Додати
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;