import React, {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {createArticle} from '../../http/articleAPI.js';

const CreateArticle = ({show, onHide, onCreated}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);

    const add = async () => {
        if (!title.trim()) return alert('Вкажіть заголовок');
        try {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('content', content);
            if (file) fd.append('image', file);
            const art = await createArticle(fd);
            onCreated(art);
            setTitle(''); setContent(''); setFile(null);
            onHide();
        } catch (e) {
            alert(e.response?.data?.message || e.message);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton><Modal.Title>Нова стаття</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        placeholder="Заголовок"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="mb-3"
                    />
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Текст статті"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="mb-3"
                    />
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={e => setFile(e.target.files[0])}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Відмінити</Button>
                <Button variant="primary" onClick={add}>Додати</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateArticle;