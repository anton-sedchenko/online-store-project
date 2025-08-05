import React, {useContext, useEffect, useState} from 'react';
import {Col, Image, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {deleteProduct, fetchProductBySlug} from "../http/productAPI.js";
import {Context} from "../main.jsx";
import {CART_ROUTE} from "../utils/consts.js";
import {Helmet} from 'react-helmet-async';

const ProductPage = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({images: []});
    const {userStore, cartStore} = useContext(Context);
    const [qty, setQty] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const {slug} = useParams();

    useEffect(() => {
        fetchProductBySlug(slug).then(data => {
            setProduct(data);
            setCurrentImageIndex(0); // скидаємо індекс при новому товарі
        });
    }, [slug]);

    const handleAddToCart = () => {
        cartStore.addItem(
            {
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                slug: product.slug
            }, qty
        );
        navigate(CART_ROUTE);
    };

    const handleDelete = async () => {
        try {
            await deleteProduct(product.id);
        } catch (e) {
            alert(e.response?.data?.message || 'Помилка при видаленні');
        }
    };

    const handlePrev = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const sum = product.price * qty;
    const activeImage = product.images?.[currentImageIndex]?.url || product.img;

    return (
        <div className="component__container">
            {product?.name && (
                <Helmet>
                    <title>{product.name} | Charivna Craft</title>
                    <meta name="description" content={product.description || 'Опис товару'} />
                    <meta property="og:title" content={product.name} />
                    <meta property="og:description" content={product.description} />
                    <meta property="og:image" content={activeImage} />
                    <meta property="og:url" content={`https://charivna-craft.com.ua/product/${product.slug}`} />
                    <meta property="og:type" content="product" />
                </Helmet>
            )}

            <Row className="product__info__row">
                <div>
                    <button
                        className="product__back-button"
                        style={{marginBottom: '1rem'}}
                        onClick={() => navigate(-1)}
                    >
                        ← Назад
                    </button>
                </div>

                <Col xs={12} md={4} className="product__img__container text-center">
                    <div style={{position: 'relative'}}>
                        <Image
                            width={300}
                            height={300}
                            src={activeImage}
                            alt={product.name}
                        />
                        {product.images?.length > 1 && (
                            <>
                                <button onClick={handlePrev} className="slider-btn prev">‹</button>
                                <button onClick={handleNext} className="slider-btn next">›</button>
                            </>
                        )}
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <div>
                        <p className="product__code">Код товару: {product.code || '---'}</p>
                        <p className="product__availability">
                            <span className="availability-label">Наявність:</span>{' '}
                            <span className={
                                product.availability === 'IN_STOCK'
                                    ? 'availability-value in-stock'
                                    : 'availability-value pre-order'
                            }>
                                {product.availability === 'IN_STOCK'
                                    ? 'В наявності'
                                    : 'Під замовлення (2-3 дні)'}
                            </span>
                        </p>
                        <h3 className="product__title">{product.name}</h3>
                        <div className="product__count__container">
                            <p className="product__count">Кількість:</p>
                            <input
                                className="product__count__input"
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                            />
                        </div>
                        <p className="product__page__total__sum">Сума: {sum} грн.</p>
                        <div className="product__page__btn__container">
                            <button className="product__page__btn" onClick={handleAddToCart}>
                                Додати в кошик
                            </button>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={2} className="purchase__conditions__container">
                    <div className="purchase__conditions__section">
                        <h6>
                            <i className="fa fa-truck" aria-hidden="true"></i>
                            Доставка
                        </h6>
                        <ul>
                            <li>Нова пошта</li>
                            <li>Укрпошта</li>
                        </ul>
                    </div>
                    <div className="purchase__conditions__section">
                        <h6>
                            <i className="fa fa-credit-card" aria-hidden="true"></i>
                            Оплата
                        </h6>
                        <ul>
                            <li>Готівкою при отриманні</li>
                            <li>Безготівковий переказ</li>
                            <li>Приват 24</li>
                        </ul>
                    </div>
                    <div className="purchase__conditions__section">
                        <h6>
                            <i className="fa fa-phone contacts__icon" aria-hidden="true"></i>
                            Замовити по телефону
                        </h6>
                        <a>Замовити дзвінок</a>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div>
                        <h4>Опис товару:</h4>
                        <p className="product__description">{product.description || 'Немає опису'}</p>
                    </div>
                </Col>
                <Col md={4}>
                    {userStore.isAuth && userStore.user.role === 'ADMIN' && (
                        <button className="neu-btn" onClick={handleDelete}>
                            Видалити фігурку
                        </button>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ProductPage;