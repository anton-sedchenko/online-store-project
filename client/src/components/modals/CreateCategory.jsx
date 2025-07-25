import React, {useState, useContext} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {createCategory} from '../../http/typeAPI.js';
import {Context} from '../../main.jsx';
import {observer} from 'mobx-react-lite';

const CreateCategory = observer(({show, onHide}) => {
    const {productStore} = useContext(Context);
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);

    const addCategory = async () => {
        if (!name.trim()) {
            return alert('Введіть назву категорії');
        }
        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            if (file) formData.append('image', file);
            await createCategory(formData);
            await productStore.fetchTypes();
            setName('');
            setFile(null);
            onHide();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Додати категорію</Modal.Title>
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
                    <Form.Group className="mb-3">
                        <Form.Label>Картинка категорії</Form.Label>
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
                <Button variant="primary" onClick={addCategory}>Додати</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateCategory;