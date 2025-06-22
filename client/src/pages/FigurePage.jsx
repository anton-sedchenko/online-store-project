import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, Image, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {deleteProduct, fetchOneFigure} from "../http/figureAPI.js";
import {Context} from "../main.jsx";
import {CART_ROUTE} from "../utils/consts.js";

const FigurePage = () => {
    const navigate = useNavigate();
    const [figure, setFigure] = useState({info: []});
    const {cart} = useContext(Context);
    const {user} = useContext(Context);
    const [qty, setQty] = useState(1);
    let sum = figure.price * qty;
    // Отримуєм параметри айді із строки запиту
    const {id} = useParams();
    // При завантаженні сторінки товару один раз підгружаємо цей товар
    useEffect(() => {
        fetchOneFigure(id).then(data => setFigure(data));
    }, []);

    const handleAddToCart = () => {
        cart.addItem(
            { id: figure.id, name: figure.name, price: figure.price, img: figure.img },
            qty
        );
        navigate(CART_ROUTE);
    }

    const handleDelete = async () => {
        try {
            await deleteProduct(id);
            navigate('/shop');
        } catch (e) {
            alert(e.response?.data?.message || 'Помилка при видаленні');
        }
    };

    return (
        <Container>
            <Row>
                <Col md={4}>
                    <Image
                        width={300}
                        height={300}
                        src={`${import.meta.env.VITE_APP_API_URL}${figure.img}`}
                    />
                </Col>
                <Col md={4}>
                    <Row>
                        <p>Код товару: {figure.code}</p>
                        <h3>{figure.name}</h3>
                        <div style={{display: "flex"}}>
                            <p>Кількість:</p>
                            <Form.Control
                                style={{width: "70px"}}
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                            />
                        </div>
                        <h4>Опис:</h4>
                        <p>{figure.description}</p>
                    </Row>
                </Col>
                <Col md={4}>
                    <Card
                        className="d-flex flex-column align-items-center justify-content-around"
                        style={{width: 300, height: 300, fontSize: 32, border: "5px solid lightgray"}}>
                        <h4>Сума: {sum} грн.</h4>
                        <Button
                            variant={"outline-dark"}
                            onClick={handleAddToCart}
                        >
                            Додати в кошик
                        </Button>
                        {user.isAuth && user.user.role === 'ADMIN' && (
                            <Button
                                variant="outline-danger"
                                onClick={handleDelete}
                            >
                                Видалити фігурку
                            </Button>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FigurePage;
