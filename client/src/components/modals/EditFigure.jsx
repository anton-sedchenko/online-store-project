import React, {useState, useEffect} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {updateFigure, fetchFigures} from '../../http/figureAPI.js';
import {fetchTypes} from '../../http/typeAPI.js';

// керує локальними станами, показом модалки й збиранням FormData
const EditFigure = ({show, onHide, figureToEdit}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [code, setCode] = useState('');
    const [typeId, setTypeId] = useState('');
    const [description, setDescription] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        if (figureToEdit) {
            setName(figureToEdit.name);
            setPrice(figureToEdit.price);
            setCode(figureToEdit.code);
            setTypeId(figureToEdit.typeId);
            setDescription(figureToEdit.description || '');
        }
        fetchTypes().then(setTypes);
    }, [figureToEdit]);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('code', code);
        formData.append('typeId', typeId);
        formData.append('description', description);
        if (imgFile) formData.append('img', imgFile);

        await updateFigure(figureToEdit.id, formData);
        onHide();
        fetchFigures(null, 1, 8).then(() => {});
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Figure</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={name} onChange={e => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" value={price} onChange={e => setPrice(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Code</Form.Label>
                        <Form.Control value={code} onChange={e => setCode(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Type</Form.Label>
                        <Form.Select value={typeId} onChange={e => setTypeId(e.target.value)}>
                            <option value="">Select type</option>
                            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea" rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={e => setImgFile(e.target.files[0])} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditFigure;