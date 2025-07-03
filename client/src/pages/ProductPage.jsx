import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, Image, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {deleteProduct, fetchOneProduct} from "../http/productAPI.js";
import {Context} from "../main.jsx";
import {CART_ROUTE} from "../utils/consts.js";
import {getImageUrl} from "../helpers/helpers.js";

const ProductPage = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({info: []});
    const {userStore, cartStore} = useContext(Context);
    const [qty, setQty] = useState(1);
    let sum = product.price * qty;
    // Отримуєм параметри айді із строки запиту
    const {id} = useParams();
    // При завантаженні сторінки товару один раз підгружаємо цей товар
    useEffect(() => {
        fetchOneProduct(id).then(data => setProduct(data));
    }, []);

    const handleAddToCart = () => {
        cartStore.addItem(
            {
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img
            }, qty
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
        <Col className="component__container">
            <Row>
                <Col xs={12} md={6} className="product__img__container">
                    <Image
                        width={300}
                        height={300}
                        src={getImageUrl(product.img)}
                    ></Image>
                </Col>
                <Col md={4}>
                    <div>
                        <p className="product__code">Код товару: {product.code}</p>
                        <h3 className="product__title">{product.name}</h3>
                        <div style={{display: "flex"}}>
                            <p className="product__count">Кількість:</p>
                            <input
                                className="neu-input"
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                            />
                        </div>
                        <h4>Опис товару:</h4>
                        <p className="product__description">{product.description}</p>
                        <h4>Сума: {sum} грн.</h4>
                    </div>
                </Col>
                <Col md={4}>
                    <div>
                        {userStore.isAuth && userStore.user.role === 'ADMIN' && (
                            <button
                                className="neu-btn"
                                onClick={handleDelete}
                            >
                                Видалити фігурку
                            </button>
                        )}
                    </div>
                </Col>
            </Row>
            <Row>
                <div className="product__page__btn__container">
                    <button
                        className="neu-btn product__page__btn"
                        onClick={handleAddToCart}
                    >
                        Додати в кошик
                    </button>
                </div>
            </Row>
        </Col>
    );
};

export default ProductPage;
