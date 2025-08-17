import React, {useContext, useEffect, useState} from 'react';
import {Col, Image, Row} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {useNavigate, useParams} from "react-router-dom";
import {deleteProduct, fetchProductBySlug} from "../http/productAPI.js";
import {Context} from "../main.jsx";
import {CART_ROUTE} from "../utils/consts.js";
import {Helmet} from 'react-helmet-async';
import CallbackModal from "../components/modals/CallbackModal.jsx";
import StarRating from "../components/StarRating.jsx";
import Reviews from "../components/Reviews.jsx";
import {getReviews, addReview, replyReview, deleteReview} from '../http/reviewAPI.js';

const ProductPage = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({images: []});
    const {userStore, cartStore} = useContext(Context);
    const [qty, setQty] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showCallback, setShowCallback] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [ratingAvg, setRatingAvg] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState({ avg: 0, count: 0 });
    const {slug} = useParams();

    useEffect(() => {
        (async () => {
            const data = await fetchProductBySlug(slug);
            setProduct(data);
            setCurrentImageIndex(0);
            // рейтинг для шапки картки
            try {
                const r = await getReviews(data.id);
                setRatingAvg(r?.rating?.avg || 0);
                setRatingCount(r?.rating?.count || 0);
            } catch {}
        })();
    }, [slug]);

    // вантажимо відгуки тільки коли вже є product.id
    useEffect(() => {
        if (!product?.id) return;               // ← важливо: НЕ робимо запит без id
        (async () => {
            try {
                const data = await getReviews(product.id);
                setReviews(data?.items || []);
                setRating(data?.rating || { avg: 0, count: 0 });
            } catch (e) {
                console.warn('Не вдалося завантажити відгуки:', e?.response?.data?.message || e.message);
            }
        })();
    }, [product?.id]);

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

    const openLightbox = (i) => { setLightboxIndex(i); setLightboxOpen(true); };
    const closeLightbox = () => setLightboxOpen(false);

    const lbPrev = () => setLightboxIndex(i => (i === 0 ? product.images.length - 1 : i - 1));
    const lbNext = () => setLightboxIndex(i => (i === product.images.length - 1 ? 0 : i + 1));

    useEffect(() => {
        if (!lightboxOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lbPrev();
            if (e.key === 'ArrowRight') lbNext();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightboxOpen, product.images?.length]);

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
                            onClick={() => openLightbox(currentImageIndex)}
                            style={{cursor: 'zoom-in'}}
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
                    <div className="product__info__container">
                        <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                            <StarRating value={ratingAvg} size={22} />
                            <span className="muted" style={{ fontSize: 13 }}>
                                {ratingCount > 0 ? `(${ratingCount})` : "(оцінок ще немає)"}
                            </span>
                        </div>
                        <p className="product__code">Код: {product.code || '---'}</p>
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
                            <li>Безкоштовна доставка при замовленні від 1500 грн.</li>
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
                        <a
                            className="purchase__conditions__callback__link"
                            onClick={() => setShowCallback(true)}
                        >
                            Замовити дзвінок
                        </a>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div>
                        <h4>Опис товару:</h4>
                        <p className="product__description">{product.description || 'Немає опису'}</p>
                    </div>
                    <Reviews
                        productId={product.id}
                        isAuth={userStore.isAuth}
                        isAdmin={userStore.isAuth && userStore.user?.role === 'ADMIN'}
                        userEmail={userStore.user?.email}
                    />
                </Col>
                <Col md={4}>
                    {userStore.isAuth && userStore.user.role === 'ADMIN' && (
                        <button className="neu-btn" onClick={handleDelete}>
                            Видалити фігурку
                        </button>
                    )}
                </Col>
            </Row>
            <CallbackModal
                show={showCallback}
                onClose={() => setShowCallback(false)}
            />

            <Modal show={lightboxOpen} onHide={closeLightbox} centered size="lg" contentClassName="bg-transparent border-0">
                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.8)',
                        borderRadius: 8,
                        padding: 8
                    }}
                >
                    <button
                        onClick={lbPrev}
                        aria-label="Попереднє"
                        className="btn btn-light"
                        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                    >‹</button>

                    <img
                        src={(product.images?.[lightboxIndex]?.url) || product.img}
                        alt={product.name}
                        style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain' }}
                    />

                    <button
                        onClick={lbNext}
                        aria-label="Наступне"
                        className="btn btn-light"
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
                    >›</button>
                </div>

                {/* Мініатюри під фото */}
                {product.images?.length > 1 && (
                    <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
                        {product.images.map((im, i) => (
                            <img
                                key={i}
                                src={im.url}
                                alt=""
                                onClick={() => setLightboxIndex(i)}
                                style={{
                                    width: 64, height: 64, objectFit: 'cover', cursor: 'pointer',
                                    border: i === lightboxIndex ? '2px solid #fff' : '2px solid transparent',
                                    borderRadius: 6
                                }}
                            />
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ProductPage;