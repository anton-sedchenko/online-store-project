import React, {useContext, useEffect, useState} from 'react';
import {Col, Image, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {deleteProduct, fetchProductBySlug} from "../http/productAPI.js";
import {Context} from "../main.jsx";
import {CART_ROUTE} from "../utils/consts.js";
import {Helmet} from 'react-helmet-async';

const ProductPage = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({info: []});
    const {userStore, cartStore} = useContext(Context);
    const [qty, setQty] = useState(1);
    let sum = product.price * qty;
    const {slug} = useParams();
    // При завантаженні сторінки товару один раз підгружаємо цей товар
    useEffect(() => {
        fetchProductBySlug(slug).then(data => setProduct(data));
    }, [slug]);

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
            await deleteProduct(product.id);
            navigate('/shop');
        } catch (e) {
            alert(e.response?.data?.message || 'Помилка при видаленні');
        }
    };

    return (
        <Col className="component__container">
            {product?.name && (
                <Helmet>
                    <title>{product.name} | Чарівна майстерня</title>
                    <meta name="description" content={product.description || 'Опис товару'} />
                    <meta property="og:title" content={product.name} />
                    <meta property="og:description" content={product.description} />
                    <meta property="og:image" content={product.img} />
                    {product?.slug && (
                        <meta property="og:url" content={`https://online-store-project-navy.vercel.app/product/${product.slug}`} />
                    )}
                    <meta property="og:type" content="product" />
                </Helmet>
            )}
            <Row>
                <Col xs={12} md={4} className="product__img__container">
                    <Image
                        width={300}
                        height={300}
                        src={product.img || ""}
                        alt={product.name || "зображення товару"}
                    ></Image>
                </Col>
                <Col xs={12} md={8}>
                    <div>
                        <p className="product__code">Код товару: {product.code || '---'}</p>
                        <h3 className="product__title">{product.name}</h3>
                        <div className="product__count__container">
                            <p className="product__count">Кількість:</p>
                            <input
                                className="neu-input product__count__input"
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                            />
                        </div>
                        <p className="product__page__total__sum">Сума: {sum} грн.</p>
                        <div className="product__page__btn__container">
                            <button
                                className="product__page__btn"
                                onClick={handleAddToCart}
                            >
                                Додати в кошик
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={12}>
                    <div>
                        <h4>Опис товару:</h4>
                        <p className="product__description">{product.description || 'Немає опису'}</p>
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
        </Col>
    );
};

export default ProductPage;
