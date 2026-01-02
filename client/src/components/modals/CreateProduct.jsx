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
    const [color, setColor] = useState('');
    const [kind, setKind] = useState('');
    const [file, setFile] = useState(null);
    const [code, setCode] = useState('');
    const [availability, setAvailability] = useState('IN_STOCK');
    const [rozetkaCategoryId, setRozetkaCategoryId] = useState('');
    const [rating, setRating] = useState(1);

    // Підгружаємо перелік типів
    useEffect(() => {
        fetchTypes().then(data => productStore.setTypes(data));
    }, []);

    const selectFile = e => {
        setFile(e.target.files[0]);
    }

    const addProduct = async () => {
        if (!productStore.selectedType.id) {
            alert("Будь ласка, оберіть категорію (тип) товару");
            return;
        }
        if (!file) {
            alert("Додайте зображення товару");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", `${price}`);
            formData.append("description", descr || "");
            formData.append("img", file);
            formData.append("typeId", productStore.selectedType.id);
            formData.append("code", code);
            formData.append('availability', availability);
            formData.append('color', (color ?? '').trim());
            formData.append('kind', (kind ?? '').trim());
            formData.append('rozetkaCategoryId', (rozetkaCategoryId ?? '').trim());
            formData.append('rating', String(rating ?? 1));

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
                        <Form.Label>ID категорії Rozetka (необов’язково)</Form.Label>
                        <Form.Control
                            type="number"
                            inputMode="numeric"
                            placeholder="Наприклад: 4632208"
                            value={rozetkaCategoryId}
                            onChange={e => setRozetkaCategoryId(e.target.value)}
                        />
                        <Form.Text muted>
                            Якщо залишити порожнім — товар не потрапить до фіду Rozetka.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Рейтинг (1–10)</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            max={10}
                            value={rating}
                            onChange={e => setRating(Number(e.target.value))}
                            onWheel={(e) => e.currentTarget.blur()}
                        />
                        <Form.Text muted>
                            Рейтинг від 1 до 10, де 10 максимум і товар буде на 1 сторінці.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Select
                            placeholder="Наявність товару"
                            value={availability}
                            onChange={e => setAvailability(e.target.value)}
                        >
                            <option value="IN_STOCK">В наявності</option>
                            <option value="MADE_TO_ORDER">Під замовлення (2–3 дні)</option>
                            <option value="OUT_OF_STOCK">Немає в наявності</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Control
                        placeholder="Колір (наприклад: айворі або світло-сірий)"
                        className="modal__input"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                    />

                    <Form.Control
                        placeholder="Тип виробу (наприклад: кошик, плейсмат, тваринка, браслет)"
                        className="modal__input"
                        value={kind}
                        onChange={e => setKind(e.target.value)}
                    />

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