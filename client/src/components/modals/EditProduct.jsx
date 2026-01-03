import React, {useState, useEffect} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {updateProduct, fetchProducts, deleteProductImage} from '../../http/productAPI.js';
import {fetchTypes} from '../../http/typeAPI.js';

// керує локальними станами, показом модалки й збиранням FormData
const EditProduct = ({show, onHide, productToEdit}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [code, setCode] = useState('');
    const [typeId, setTypeId] = useState('');
    const [color, setColor] = useState('');
    const [kind, setKind] = useState('');
    const [description, setDescription] = useState('');
    const [imgFiles, setImgFiles] = useState([]);
    const [types, setTypes] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [availability, setAvailability] = useState('IN_STOCK');
    const [rozetkaCategoryId, setRozetkaCategoryId] = useState('');
    const [rating, setRating] = useState(1);
    const [width, setWidth] = useState('');
    const [length, setLength] = useState('');
    const [height, setHeight] = useState('');
    const [diameter, setDiameter] = useState('');
    const [weightKg, setWeightKg] = useState('');
    const [country, setCountry] = useState('Україна');
    const [material, setMaterial] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name || '');
            setPrice(productToEdit.price || '');
            setCode(productToEdit.code || '');
            setTypeId(productToEdit.typeId || '');
            setColor(productToEdit.color || '');
            setKind(productToEdit.kind || '');
            setDescription(productToEdit.description || '');
            setExistingImages(Array.isArray(productToEdit.images) ? productToEdit.images : []);
            setMainImageUrl(productToEdit.img || '');
            setRozetkaCategoryId(productToEdit.rozetkaCategoryId ? String(productToEdit.rozetkaCategoryId) : '');
            setAvailability(productToEdit.availability || 'IN_STOCK');
            setRating(productToEdit.rating ?? 1);
            setWidth(productToEdit.width || '');
            setLength(productToEdit.length || '');
            setHeight(productToEdit.height || '');
            setDiameter(productToEdit.diameter || '');
            setWeightKg(productToEdit.weightKg || '');
            setCountry(productToEdit.country || 'Україна');
            setMaterial(productToEdit.material || '');
        }
        fetchTypes().then(setTypes);
    }, [productToEdit]);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('code', code);
        formData.append('typeId', typeId);
        formData.append('color', (color ?? '').trim());
        formData.append('kind', (kind ?? '').trim());
        formData.append('description', description);
        formData.append('availability', availability);
        formData.append('width', (width ?? '').trim());
        formData.append('length', (length ?? '').trim());
        formData.append('height', (height ?? '').trim());
        formData.append('diameter', (diameter ?? '').trim());
        formData.append('weightKg', (weightKg ?? '').trim());
        formData.append('country', (country ?? 'Україна').trim());
        formData.append('material', (material ?? '').trim());
        
        if (mainImageFile) {
            formData.append('img', mainImageFile);
        }
        imgFiles.forEach((file) => {
            formData.append('images', file); // саме цей рядок додає кілька файлів
        });
        formData.append('rozetkaCategoryId', (rozetkaCategoryId ?? '').trim());
        formData.append('rating', String(rating ?? 1));
        
        await updateProduct(productToEdit.id, formData);
        onHide();
        fetchProducts(null, 1, 8).then(() => {});
    };

    const handleDeleteImage = async (imageId) => {
        await deleteProductImage(imageId);
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Редагування товару</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Назва</Form.Label>
                        <Form.Control value={name} onChange={e => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Ціна</Form.Label>
                        <Form.Control type="number" value={price} onChange={e => setPrice(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Код товару</Form.Label>
                        <Form.Control value={code} onChange={e => setCode(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Наявність</Form.Label>
                        <Form.Select
                            value={availability}
                            onChange={e => setAvailability(e.target.value)}
                        >
                            <option value="IN_STOCK">В наявності</option>
                            <option value="MADE_TO_ORDER">Під замовлення (2–3 дні)</option>
                            <option value="OUT_OF_STOCK">Немає в наявності</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Тип</Form.Label>
                        <Form.Select value={typeId} onChange={e => setTypeId(e.target.value)}>
                            <option value="">Select type</option>
                            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>ID Категорії Rozetka (необов’язково)</Form.Label>
                        <Form.Control
                            type="number"
                            inputMode="numeric"
                            placeholder="Напр.: 4632208"
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
                            Рейтинг товару від 1 до 10, де 10 максимум і товар буде на 1 сторінці.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Колір</Form.Label>
                        <Form.Control
                            placeholder="Напр.: айворі, світло-сірий"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Тип виробу</Form.Label>
                        <Form.Control
                            placeholder="Напр.: кошик, плейсмат, тваринка, браслет"
                            value={kind}
                            onChange={e => setKind(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Розміри (см)</Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Control
                                placeholder="Ширина"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                            />
                            <Form.Control
                                placeholder="Довжина"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                            />
                            <Form.Control
                                placeholder="Висота"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>
                        <Form.Text muted>Заповнюй тільки те, що актуально для виробу.</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <div className="d-flex gap-2">
                            <Form.Control
                                placeholder="Діаметр (см)"
                                value={diameter}
                                onChange={(e) => setDiameter(e.target.value)}
                            />
                            <Form.Control
                                placeholder="Вага (кг)"
                                value={weightKg}
                                onChange={(e) => setWeightKg(e.target.value)}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Країна виробник</Form.Label>
                        <Form.Control
                            placeholder="Україна"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Матеріал</Form.Label>
                        <Form.Control
                            placeholder="Напр.: бавовняний шнур / гіпс / бісер"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Опис товару</Form.Label>
                        <Form.Control
                            as="textarea" rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Головне зображення</Form.Label>
                        {mainImageUrl && (
                            <div className="mb-2">
                                <img src={mainImageUrl} alt="main" style={{width: '100px'}} />
                            </div>
                        )}
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={e => setMainImageFile(e.target.files[0])}
                        />

                        <Form.Group className="mb-2">
                            <Form.Label>Додаткові зображення</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={e => setImgFiles(Array.from(e.target.files))}
                            />
                        </Form.Group>


                        <div className="existing-images">
                            {existingImages.map(img => (
                                <div key={img.id} className="img-thumb-wrapper">
                                    <img src={img.url} alt="existing" className="img-thumb" />
                                    <button
                                        type="button"
                                        className="delete-btn"
                                        onClick={() => handleDeleteImage(img.id)}
                                    >×</button>
                                </div>
                            ))}
                        </div>

                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Відмінити</Button>
                <Button variant="primary" onClick={handleSave}>Зберегти</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditProduct;