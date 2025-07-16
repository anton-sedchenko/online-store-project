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
    const [description, setDescription] = useState('');
    const [imgFiles, setImgFiles] = useState([]);
    const [types, setTypes] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImageUrl, setMainImageUrl] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name || '');
            setPrice(productToEdit.price || '');
            setCode(productToEdit.code || '');
            setTypeId(productToEdit.typeId || '');
            setDescription(productToEdit.description || '');
            setExistingImages(Array.isArray(productToEdit.images) ? productToEdit.images : []);
            setMainImageUrl(productToEdit.img || '');
        }
        fetchTypes().then(setTypes);
    }, [productToEdit]);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('code', code);
        formData.append('typeId', typeId);
        formData.append('description', description);
        if (mainImageFile) {
            formData.append('img', mainImageFile);
        }
        imgFiles.forEach((file) => {
            formData.append('images', file); // саме цей рядок додає кілька файлів
        });


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
                        <Form.Label>Тип</Form.Label>
                        <Form.Select value={typeId} onChange={e => setTypeId(e.target.value)}>
                            <option value="">Select type</option>
                            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </Form.Select>
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