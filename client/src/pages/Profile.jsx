import React, {useContext, useEffect, useState} from 'react';
import {Tab, Nav, Row, Col, Form, Table} from 'react-bootstrap';
import {observer} from 'mobx-react-lite';
import {Context} from '../main.jsx';
import {fetchMyOrders} from '../http/orderAPI.js';
import {changePassword, updateProfile} from "../http/userAPI.js";
import {Helmet} from "react-helmet-async";
import {LOGIN_ROUTE} from "../utils/consts.js";
import {Navigate} from "react-router-dom";

const Profile = observer(() => {
    const {userStore} = useContext(Context);

    if (!userStore.isAuth) {
        return <Navigate to={LOGIN_ROUTE} replace/>;
    }

    // стейт форми профілю
    const [form, setForm] = useState({
        name: '', email: '', phone: ''
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
                name: userStore.user.name || '',
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
                name: updated.name || '',
                email: updated.email || '',
                phone: updated.phone || ''
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
        <>
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="component__container">
                <Tab.Container activeKey={tab} onSelect={k => setTab(k)}>
                    <Row>
                        <Col sm={3} className="profile__tabs__container">
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item
                                    className="profile__tab"
                                >
                                    <Nav.Link eventKey="personal">Персональні дані</Nav.Link>
                                </Nav.Item>
                                <Nav.Item
                                    className="profile__tab"
                                >
                                    <Nav.Link eventKey="orders">Мої замовлення</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>

                                {/* Персональні дані */}
                                <Tab.Pane eventKey="personal">
                                    <h4>Редагування профілю</h4>
                                    <Form onSubmit={handlePersonalSave} className="mb-4">
                                        <Form.Group className="mb-3" controlId="name">
                                            <Form.Label>Ім’я</Form.Label>
                                            <input
                                                className="profile__input"
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <input
                                                className="profile__input"
                                                type="email"
                                                value={form.email}
                                                onChange={e => setForm({...form, email: e.target.value})}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="phone">
                                            <Form.Label>Телефон</Form.Label>
                                            <input
                                                className="profile__input"
                                                type="tel"
                                                value={form.phone}
                                                onChange={e => setForm({...form, phone: e.target.value})}
                                            />
                                        </Form.Group>
                                        <button className="neu-btn" type="submit">Зберегти зміни</button>
                                    </Form>

                                    <h4>Зміна паролю</h4>
                                    <Form onSubmit={handlePasswordSave}>
                                        <Form.Group className="mb-3" controlId="currentPassword">
                                            <Form.Label>Старий пароль</Form.Label>
                                            <input
                                                className="profile__input"
                                                type="password"
                                                value={passwords.current}
                                                onChange={e => setPasswords({...passwords, current: e.target.value})}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="newPassword">
                                            <Form.Label>Новий пароль</Form.Label>
                                            <input
                                                className="profile__input"
                                                type="password"
                                                value={passwords.new}
                                                onChange={e => setPasswords({...passwords, new: e.target.value})}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="confirmPassword">
                                            <Form.Label>Підтвердження паролю</Form.Label>
                                            <input
                                                className="profile__input"
                                                type="password"
                                                value={passwords.confirm}
                                                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                            />
                                        </Form.Group>
                                        <button className="neu-btn" type="submit">Змінити пароль</button>
                                    </Form>
                                </Tab.Pane>

                                {/* Мої замовлення */}
                                <Tab.Pane eventKey="orders">
                                    <h4>Мої замовлення</h4>
                                    <Table
                                        className="orders__history__table"
                                        responsive striped bordered hover
                                    >
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
                                                    {o.order_products.map(of => {
                                                        const productName = of.product?.name ?? '—';
                                                        return (
                                                            <div key={of.id}>
                                                                {productName} × {of.quantity}
                                                            </div>
                                                        );
                                                    })}
                                                </td>
                                                <td>
                                                    {o.order_products.reduce((sum, of) =>
                                                        sum + (of.product?.price ?? 0) * of.quantity, 0
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
            </div>
        </>
    );
});

export default Profile;
