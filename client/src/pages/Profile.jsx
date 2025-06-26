import React, {useContext, useEffect, useState} from 'react';
import {Container, Tab, Nav, Row, Col, Form, Button, Table} from 'react-bootstrap';
import {observer} from 'mobx-react-lite';
import {Context} from '../main.jsx';
import {fetchMyOrders} from '../http/orderAPI.js';
import {changePassword, updateProfile} from "../http/userAPI.js";

const Profile = observer(() => {
    const {userStore} = useContext(Context);

    // стейт форми профілю
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: ''
    });
    // стейт паролів
    const [passwords, setPasswords] = useState({
        current: '', new: '', confirm: ''
    });
    // замовлення
    const [orders, setOrders] = useState([]);
    // вкладки
    const [tab, setTab] = useState('personal');

    useEffect(() => {
        if (userStore.user && userStore.user.id) {
            setForm({
                firstName: userStore.user.firstName || '',
                lastName: userStore.user.lastName || '',
                email: userStore.user.email || '',
                phone: userStore.user.phone || ''
            });
        }
        fetchMyOrders()
            .then(data => setOrders(data))
            .catch(console.error);
    }, [userStore.user]);

    // збереження персональних даних
    const handlePersonalSave = async e => {
        e.preventDefault();
        try {
            const updated = await updateProfile(form);
            // оновлюємо MobX-стор
            userStore.setUser(updated);
            // і форму, щоб відразу відобразити збережені значення
            setForm({
                firstName: updated.firstName,
                lastName: updated.lastName,
                email: updated.email,
                phone: updated.phone
            });
            alert('Дані профілю оновлено');
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    // зміна пароля
    const handlePasswordSave = async e => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return alert('Нові паролі не співпадають');
        }
        try {
            await changePassword({
                oldPassword: passwords.current,
                newPassword: passwords.new
            });
            alert('Пароль успішно змінено');
            setPasswords({current: '', new: '', confirm: ''});
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    return (
        <Container className="mt-4">
            <Tab.Container activeKey={tab} onSelect={k => setTab(k)}>
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item><Nav.Link eventKey="personal">Персональні дані</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="orders">Мої замовлення</Nav.Link></Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>

                            {/* Персональні дані */}
                            <Tab.Pane eventKey="personal">
                                <h4>Редагування профілю</h4>
                                <Form onSubmit={handlePersonalSave} className="mb-4">
                                    <Form.Group className="mb-3" controlId="firstName">
                                        <Form.Label>Ім'я</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.firstName}
                                            onChange={e => setForm({ ...form, firstName: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="lastName">
                                        <Form.Label>Прізвище</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.lastName}
                                            onChange={e => setForm({...form, lastName: e.target.value})}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm({...form, email: e.target.value})}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="phone">
                                        <Form.Label>Телефон</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            value={form.phone}
                                            onChange={e => setForm({...form, phone: e.target.value})}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">Зберегти</Button>
                                </Form>

                                <h4>Зміна паролю</h4>
                                <Form onSubmit={handlePasswordSave}>
                                    <Form.Group className="mb-3" controlId="currentPassword">
                                        <Form.Label>Старий пароль</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={passwords.current}
                                            onChange={e => setPasswords({...passwords, current: e.target.value})}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="newPassword">
                                        <Form.Label>Новий пароль</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={passwords.new}
                                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="confirmPassword">
                                        <Form.Label>Підтвердження паролю</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={passwords.confirm}
                                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                        />
                                    </Form.Group>
                                    <Button variant="secondary" type="submit">Змінити пароль</Button>
                                </Form>
                            </Tab.Pane>

                            {/* Мої замовлення */}
                            <Tab.Pane eventKey="orders">
                                <h4>Мої замовлення</h4>
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Номер замовлення</th>
                                        <th>Дата</th>
                                        <th>Товари (назва × кількість)</th>
                                        <th>Сума</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((o, idx) => (
                                        <tr key={o.id}>
                                            <td>{idx + 1}</td>
                                            <td>{o.id}</td>
                                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                {o.order_products.map(of => (
                                                    <div key={of.id}>
                                                        {of.product.name} × {of.quantity}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {o.order_products.reduce((sum, of) =>
                                                    sum + of.product.price * of.quantity, 0
                                                )} грн.
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>

                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
});

export default Profile;
