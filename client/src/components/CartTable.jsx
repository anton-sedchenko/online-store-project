import React, {useContext, useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {FIGURE_ROUTE, ORDER_ROUTE} from "../utils/consts.js";
import {Button, Image} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import SideBar from "./SideBar.jsx";

const CartTable = observer(() => {
    const {cart} = useContext(Context);
    const [draftQty, setDraftQty] = useState({});
    const navigate = useNavigate();

    // дістаємо локальний стейт cart.items
    useEffect(() => {
        const map = {};
        cart.items.forEach(i => { map[i.id] = i.quantity; });
        setDraftQty(map);
    }, [cart.items]);

    // Рахуємо суму одразу по змінам в draftQty
    const total = cart.items.reduce((sum, item) => {
        const q = draftQty[item.id] ?? item.quantity;
        return sum + item.price * q;
    }, 0);

    const handleOrder = () => navigate(ORDER_ROUTE);

    return (
        <>
            <SideBar/>
            <div className="cart__table__container">
                <h2>Ваше замовлення:</h2>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Товар</th>
                        <th>Ціна</th>
                        <th>Кількість</th>
                        <th>Сума</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {cart.items.map((item, idx) => (
                        <tr key={cart._isGuest ? item.id : item.cartFigureId}>
                            <td>{idx + 1}</td>
                            <td>
                                <Link
                                    to={`${FIGURE_ROUTE}/${item.id}`}
                                    className="d-flex align-items-center"
                                >
                                    <Image
                                        src={`${import.meta.env.VITE_APP_API_URL}${item.img}`}
                                        width={50}
                                        height={50}
                                        className="me-2"
                                    />
                                    {item.name}
                                </Link>
                            </td>
                            <td>{item.price} грн.</td>
                            <td style={{width: 100}}>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    value={draftQty[item.id] ?? item.quantity}
                                    onChange={e => {
                                        const v = Number(e.target.value);
                                        setDraftQty(prev => ({ ...prev, [item.id]: isNaN(v) ? 0 : v }));
                                    }}
                                    // коли уходимо з інпута, синхронізуємо зі стором та сервером
                                    onBlur={() => {
                                        const v = draftQty[item.id];
                                        cart.setQuantity(item.id, v);
                                    }}
                                />
                            </td>
                            <td>{item.price * (draftQty[item.id] ?? item.quantity)} грн.</td>
                            <td>
                                <Button variant="outline-danger" size="sm"
                                        onClick={() => cart.removeItem(item.cartFigureId)}
                                >
                                    ×
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {cart.items.length > 0 && (
                        <tr key="total">
                            <td colSpan={4} style={{textAlign: "right", fontWeight: "bold"}}>
                                Разом до оплати:
                            </td>
                            <td colSpan={2} style={{fontWeight: "bold"}}>
                                {total} грн.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
                {cart.items.length > 0 && (
                        <Button variant="light"
                                style={{border: "1px solid purple"}}
                                onClick={handleOrder}
                        >
                            Оформити замовлення
                        </Button>
                    )
                }
                {cart.items.length === 0 && (<p>Кошик порожній</p>)}
            </div>
        </>
    );
});

export default CartTable;