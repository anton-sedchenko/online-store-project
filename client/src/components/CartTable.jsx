import React, {useContext} from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {FIGURE_ROUTE} from "../utils/consts.js";
import {Button, Image} from "react-bootstrap";
import {Link} from "react-router-dom";
import SideBar from "./SideBar.jsx";

const CartTable = observer(() => {
    const {cart} = useContext(Context);

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
                    {cart.items.map((item, idx) => {
                        return (
                            <tr>
                                <td>{idx + 1}</td>
                                <td>
                                    <Link to={`${FIGURE_ROUTE}/${item.id}`} className="d-flex align-items-center">
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
                                        value={item.quantity}
                                        onChange={(e) =>
                                            cart.setQuantity(item.id, Number(e.target.value))
                                        }
                                    />
                                </td>
                                <td>{item.price * item.quantity} грн.</td>
                                <td>
                                    <Button variant="outline-danger" size="sm"
                                            onClick={() => cart.removeItem(item.id)}
                                    >
                                        ×
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                    {cart.items.length > 0 && (
                        <tr>
                            <td colSpan={4} style={{textAlign: "right", fontWeight: "bold"}}>
                                Разом до оплати:
                            </td>
                            <td colSpan={2} style={{fontWeight: "bold"}}>
                                {cart.total} грн.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        </>
    );
});

export default CartTable;