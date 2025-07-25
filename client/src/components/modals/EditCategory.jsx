import React, {useState, useEffect} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {fetchOneType, updateType, updateTypeImage} from '../../http/typeAPI.js';

const EditCategory = ({show, onHide, typeId}) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        if (typeId) {
            fetchOneType(typeId).then(type => {
                setName(type.name);
                setCurrentImage(type.image || '');
            });
        }
    }, [typeId]);

    const saveChanges = async () => {
        try {
            await updateType(typeId, {name});
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                await updateTypeImage(typeId, formData);
            }
            onHide();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Редагувати категорію</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Назва категорії</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </Form.Group>
                    {currentImage && (
                        <div className="mb-3">
                            <img src={currentImage} alt="current" width="100" />
                        </div>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Змінити картинку</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={e => setFile(e.target.files[0])}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Відмінити</Button>
                <Button variant="primary" onClick={saveChanges}>Зберегти</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditCategory;