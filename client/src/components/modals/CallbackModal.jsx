import React, {useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import axios from 'axios'

export default function CallbackModal({show, onHide}) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [comment, setComment] = useState('')
    const [sending, setSending] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        setError(null)
        try {
            await axios.post('/api/callback', {name, phone, comment});
            onHide(); // закриваємо модалку
            setName('');
            setPhone('');
            setComment('');
            alert('Дякуєм! Очікуйте дзвінок.');
        } catch (e) {
            console.error(e)
            setError('Не вдалося відправити. Спробуйте пізніше.')
        } finally {
            setSending(false)
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Замовити зворотній дзвінок</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Ім’я</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ваше ім’я"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Телефон</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="+380XXXXXXXXX"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Коментар (необов’язково)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Ваше повідомлення"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                    </Form.Group>
                    {error && <div className="text-danger">{error}</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={sending}>
                        Відмінити
                    </Button>
                    <Button variant="primary" type="submit" disabled={sending}>
                        {sending ? 'Відправка...' : 'Замовити дзвінок'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}