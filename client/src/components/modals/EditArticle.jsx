import React, {useState, useEffect} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {updateArticle} from '../../http/articleAPI.js';

const EditArticle = ({show, onHide, articleToEdit, onUpdated}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (articleToEdit) {
            setTitle(articleToEdit.title);
            setContent(articleToEdit.content);
        }
    }, [articleToEdit]);

    const save = async () => {
        if (!title.trim()) return alert('Заголовок не може бути порожнім');
        try {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('content', content);
            if (file) fd.append('image', file);
            const updated = await updateArticle(articleToEdit.id, fd);
            onUpdated(updated);
            onHide();
        } catch (e) {
            console.error('UPDATE ARTICLE ERROR:', e.response?.data || e.message);
            alert(e.response?.data?.error || e.response?.data?.message || e.message);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Редагувати статтю</Modal.Title>
            </Modal.Header>
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
                <Button variant="primary" onClick={save}>Зберегти</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditArticle;