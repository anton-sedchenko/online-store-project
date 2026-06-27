import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Col, Image, Row} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {Link, useNavigate, useParams} from "react-router-dom";
import {fetchProductBySlug} from "../http/productAPI.js";
import {Context} from "../main.jsx";
import {CART_ROUTE, DELIVERY_PAYMENT_ROUTE, RETURN_POLICY_ROUTE} from "../utils/consts.js";
import {Helmet} from 'react-helmet-async';
import CallbackModal from "../components/modals/CallbackModal.jsx";
import StarRating from "../components/StarRating.jsx";
import Reviews from "../components/Reviews.jsx";
import {getReviews} from '../http/reviewAPI.js';
import {getAvailabilityClass, getAvailabilityLabel, isPurchasableAvailability} from '../utils/availability.js';

const normalizeQuantity = (value) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue) || numericValue < 1) {
        return 1;
    }

    return Math.floor(numericValue);
};

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
    const [productLoading, setProductLoading] = useState(true);
    const [productNotFound, setProductNotFound] = useState(false);
    const {slug} = useParams();

    useEffect(() => {
        let isMounted = true;

        const loadProduct = async () => {
            setProductLoading(true);
            setProductNotFound(false);

            try {
                const data = await fetchProductBySlug(slug);

                if (!isMounted) return;

                setProduct({
                    ...data,
                    images: Array.isArray(data?.images) ? data.images : [],
                });

                setCurrentImageIndex(0);
            } catch (error) {
                if (!isMounted) return;

                if (error?.response?.status === 404) {
                    setProductNotFound(true);
                    setProduct({images: []});
                } else {
                    console.error(
                        "Не вдалося завантажити товар:",
                        error?.response?.data?.message || error.message
                    );
                    setProductNotFound(true);
                    setProduct({images: []});
                }
            } finally {
                if (isMounted) {
                    setProductLoading(false);
                }
            }
        };

        loadProduct();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    useEffect(() => {
        if (!product?.id) return;
        (async () => {
            try {
                const data = await getReviews(product.id);
                setRatingAvg(data?.rating?.avg || 0);
                setRatingCount(data?.rating?.count || 0);
            } catch (e) {
                console.warn('Не вдалося завантажити рейтинг:', e?.response?.data?.message || e.message);
            }
        })();
    }, [product?.id]);

    const isPurchasable = isPurchasableAvailability(product.availability);

    const handleAddToCart = () => {
        if (!isPurchasable) return;

        cartStore.addItem(
            {
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                slug: product.slug,
                availability: product.availability
            },
            normalizedQty
        );
        navigate(CART_ROUTE);
    };

    const handlePrev = () => {
        const imagesCount = product.images?.length || 0;
        if (imagesCount <= 1) return;
        setCurrentImageIndex((prev) => (prev === 0 ? imagesCount - 1 : prev - 1));
    };

    const handleNext = () => {
        const imagesCount = product.images?.length || 0;
        if (imagesCount <= 1) return;
        setCurrentImageIndex((prev) => (prev === imagesCount - 1 ? 0 : prev + 1));
    };

    const openLightbox = (i) => {
        setLightboxIndex(i);
        setLightboxOpen(true);
    };

    const closeLightbox = () => setLightboxOpen(false);

    const lbPrev = () => {
        const imagesCount = product.images?.length || 0;
        if (imagesCount <= 1) return;
        setLightboxIndex(i => (i === 0 ? imagesCount - 1 : i - 1));
    };

    const lbNext = () => {
        const imagesCount = product.images?.length || 0;
        if (imagesCount <= 1) return;
        setLightboxIndex(i => (i === imagesCount - 1 ? 0 : i + 1));
    };

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

    const normalizedQty = normalizeQuantity(qty);
    const unitPrice = Number(product.price || 0);
    const sum = unitPrice * normalizedQty;
    const activeImage = product.images?.[currentImageIndex]?.url || product.img;

    const availabilityLabel = useMemo(() => getAvailabilityLabel(product.availability), [product.availability]);

    const availabilityClass = useMemo(() => getAvailabilityClass(product.availability), [product.availability]);

    const dimensionsText = useMemo(() => {
        const parts = [];

        if (product.diameter) parts.push(`діаметр ${product.diameter} см`);
        if (product.height) parts.push(`висота ${product.height} см`);

        if (product.width && product.length) {
            parts.push(`розмір ${product.length}×${product.width} см`);
        } else if (product.width) {
            parts.push(`ширина ${product.width} см`);
        } else if (product.length) {
            parts.push(`довжина ${product.length} см`);
        }

        return parts.join(', ');
    }, [product.diameter, product.height, product.width, product.length]);

    const productColor = product.color?.trim();
    const productMaterial = product.material?.trim();
    const productKind = product.kind?.trim();

    const compactCharacteristics = useMemo(() => {
        const rows = [];

        if (productKind) rows.push({label: 'Тип виробу', value: productKind});
        if (dimensionsText) rows.push({label: 'Розмір', value: dimensionsText});
        if (productMaterial) rows.push({label: 'Матеріал', value: productMaterial});
        if (productColor) rows.push({label: 'Колір', value: productColor});

        return rows.filter((item) => item.value).slice(0, 4);
    }, [productKind, dimensionsText, productMaterial, productColor]);

    const seoTitle = useMemo(() => {
        const parts = [product.name];

        if (productColor && !product.name?.toLowerCase().includes(productColor.toLowerCase())) {
            parts.push(productColor);
        }

        parts.push('Charivna Craft');

        const raw = parts.filter(Boolean).join(' – ');
        return raw.length > 70 ? `${raw.slice(0, 67)}…` : raw;
    }, [product.name, productColor]);

    const metaDescription = useMemo(() => {
        const parts = [];

        if (product.name) parts.push(product.name);
        if (dimensionsText) parts.push(dimensionsText);
        if (productColor) parts.push(`колір: ${productColor}`);
        if (productMaterial) parts.push(`матеріал: ${productMaterial}`);
        parts.push('Ручна робота від Charivna Craft. Доставка по Україні.');

        const text = parts.join('. ');
        return text.length > 160 ? `${text.slice(0, 157)}…` : text;
    }, [product.name, dimensionsText, productColor, productMaterial]);

    const imageAlt = useMemo(() => {
        const altParts = [product.name];
        if (dimensionsText) altParts.push(dimensionsText);
        if (productColor) altParts.push(productColor);
        return altParts.filter(Boolean).join(', ');
    }, [product.name, dimensionsText, productColor]);

    const characteristics = useMemo(() => {
        const rows = [];

        if (productKind) rows.push({label: 'Тип виробу', value: productKind});
        if (productColor) rows.push({label: 'Колір', value: productColor});
        if (productMaterial) rows.push({label: 'Матеріал', value: productMaterial});
        if (product.country) rows.push({label: 'Країна виробництва', value: product.country});
        if (product.diameter) rows.push({label: 'Діаметр', value: `${product.diameter} см`});
        if (product.height) rows.push({label: 'Висота', value: `${product.height} см`});
        if (product.width) rows.push({label: 'Ширина', value: `${product.width} см`});
        if (product.length) rows.push({label: 'Довжина', value: `${product.length} см`});
        if (product.weightKg) rows.push({label: 'Вага', value: `${product.weightKg} кг`});

        return rows;
    }, [
        productKind,
        productColor,
        productMaterial,
        product.country,
        product.diameter,
        product.height,
        product.width,
        product.length,
        product.weightKg
    ]);

    const schemaImages = useMemo(() => {
        const imgs = [
            product.img,
            ...(Array.isArray(product.images) ? product.images.map(i => i?.url) : [])
        ].filter(Boolean);

        return [...new Set(imgs)];
    }, [product.img, product.images]);

    const schemaAvailability = useMemo(() => {
        if (product.availability === 'IN_STOCK') return 'https://schema.org/InStock';
        if (product.availability === 'OUT_OF_STOCK') return 'https://schema.org/OutOfStock';
        return 'https://schema.org/PreOrder';
    }, [product.availability]);

    const breadcrumbSchema = useMemo(() => {
        if (!product?.slug || !product?.name) return null;

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Головна",
                    item: "https://charivna-craft.com.ua/",
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: product.name,
                    item: `https://charivna-craft.com.ua/product/${product.slug}`,
                },
            ],
        };
    }, [product.slug, product.name]);

    if (productLoading) {
        return (
            <div className="component__container">
                <div className="product__content__card">
                    <p>Завантаження товару...</p>
                </div>
            </div>
        );
    }

    if (productNotFound) {
        return (
            <>
                <Helmet>
                    <title>Товар не знайдено — Charivna Craft</title>
                    <meta name="robots" content="noindex, nofollow" />
                    <meta
                        name="description"
                        content="Цей товар більше недоступний або сторінку було переміщено."
                    />
                </Helmet>

                <div className="component__container">
                    <section className="product-not-found">
                        <div className="product-not-found__visual">
                            <img
                                className="product-not-found__image"
                                src="/cat-tangled-cord.png"
                                alt="Котик заплутався в бавовняному шнурі"
                            />
                        </div>

                        <div className="product-not-found__content">
                            <p className="product-not-found__eyebrow">
                                Сторінку не знайдено
                            </p>

                            <h1>Ой, цей товар розплівся</h1>

                            <p>
                                Схоже, сторінка більше не існує або товар уже прибрали
                                з каталогу. Але в нашій майстерні ще багато красивих
                                речей для дому.
                            </p>

                            <div className="product-not-found__actions">
                                <button
                                    type="button"
                                    className="product-not-found__secondary"
                                    onClick={() => navigate("/")}
                                >
                                    На головну
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </>
        );
    }

    return (
        <div className="component__container">
            {product?.id && (
                <Helmet>
                    <title>{seoTitle}</title>
                    <link
                        rel="canonical"
                        href={`https://charivna-craft.com.ua/product/${product.slug}`}
                    />
                    <meta name="description" content={metaDescription} />
                    <meta property="og:title" content={seoTitle} />
                    <meta property="og:description" content={metaDescription} />
                    <meta property="og:image" content={activeImage} />
                    <meta
                        property="og:url"
                        content={`https://charivna-craft.com.ua/product/${product.slug}`}
                    />
                    <meta property="og:type" content="product" />

                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Product",
                            name: product.name,
                            image: schemaImages,
                            description: product.description || metaDescription,
                            sku: product.code,
                            mpn: product.code,
                            brand: {
                                "@type": "Brand",
                                name: "Charivna Craft",
                            },
                            material: product.material || undefined,
                            color: product.color || undefined,
                            countryOfOrigin: product.country || undefined,
                            offers: {
                                "@type": "Offer",
                                url: `https://charivna-craft.com.ua/product/${product.slug}`,
                                priceCurrency: "UAH",
                                price: product.price,
                                availability: schemaAvailability,
                                itemCondition: "https://schema.org/NewCondition",
                                shippingDetails: {
                                    "@type": "OfferShippingDetails",
                                    shippingDestination: {
                                        "@type": "DefinedRegion",
                                        addressCountry: "UA",
                                    },
                                    deliveryTime: {
                                        "@type": "ShippingDeliveryTime",
                                        handlingTime: {
                                            "@type": "QuantitativeValue",
                                            minValue: 0,
                                            maxValue: product.availability === "PRE_ORDER" ? 3 : 1,
                                            unitCode: "DAY",
                                        },
                                        transitTime: {
                                            "@type": "QuantitativeValue",
                                            minValue: 1,
                                            maxValue: 3,
                                            unitCode: "DAY",
                                        },
                                    },
                                },
                                hasMerchantReturnPolicy: {
                                    "@type": "MerchantReturnPolicy",
                                    applicableCountry: "UA",
                                    returnPolicyCategory:
                                        "https://schema.org/MerchantReturnFiniteReturnWindow",
                                    merchantReturnDays: 14,
                                    returnMethod: "https://schema.org/ReturnByMail",
                                    returnFees:
                                        "https://schema.org/ReturnFeesCustomerResponsibility",
                                    merchantReturnLink:
                                        "https://charivna-craft.com.ua/return-policy",
                                },
                            },
                            aggregateRating:
                                ratingCount > 0
                                    ? {
                                        "@type": "AggregateRating",
                                        ratingValue: Number(ratingAvg).toFixed(1),
                                        reviewCount: ratingCount,
                                    }
                                    : undefined,
                        })}
                    </script>

                    {breadcrumbSchema && (
                        <script type="application/ld+json">
                            {JSON.stringify(breadcrumbSchema)}
                        </script>
                    )}
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
                    <div className="product__gallery">
                        <Image
                            width={300}
                            height={300}
                            src={activeImage}
                            alt={imageAlt}
                            onClick={() => openLightbox(currentImageIndex)}
                            style={{cursor: 'zoom-in'}}
                        />
                        {product.images?.length > 1 && (
                            <>
                                <button onClick={handlePrev} className="slider-btn prev" aria-label="Попереднє фото">‹</button>
                                <button onClick={handleNext} className="slider-btn next" aria-label="Наступне фото">›</button>
                            </>
                        )}
                    </div>
                </Col>

                <Col xs={12} md={5}>
                    <div className="product__info__container">
                        <h1 className="product__title">{product.name}</h1>

                        <div className="product__meta__row" aria-label="Інформація про рейтинг і код товару">
                            <div className="product__rating__top">
                                <StarRating value={ratingAvg} size={18} />
                                <span className="muted product__rating__count">
                                    {ratingCount > 0 ? `Оцінок: ${ratingCount}` : "Оцінок ще немає"}
                                </span>
                            </div>

                            <span className="product__code">Код: {product.code || '---'}</span>
                        </div>

                        <p className="product__availability">
                            <span className="availability-label">Статус:</span>{' '}
                            <span className={availabilityClass}>
                                {availabilityLabel}
                            </span>
                        </p>

                        {product.availability === 'MADE_TO_ORDER' && (
                            <p className="product__made-to-order-note">
                                Виготовлення: 1–3 робочі дні. За великої черги замовлень, вимкнень електроенергії або для гуртового замовлення строк може бути довшим — його погодимо з вами під час підтвердження замовлення.
                            </p>
                        )}

                        <p className="product__unit__price">
                            <strong>{unitPrice}</strong> грн
                        </p>

                        {compactCharacteristics.length > 0 && (
                            <div className="product__quick__characteristics" aria-label="Ключові характеристики">
                                {compactCharacteristics.map((item) => (
                                    <div key={item.label} className="product__quick__characteristic">
                                        <span>{item.label}</span>
                                        <strong>{item.value}</strong>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="product__count__container">
                            <label className="product__count" htmlFor="product-quantity">Кількість</label>
                            <div className="product__quantity__stepper">
                                <button
                                    type="button"
                                    className="product__quantity__button"
                                    aria-label="Зменшити кількість"
                                    onClick={() => setQty(normalizeQuantity(normalizedQty - 1))}
                                    disabled={normalizedQty <= 1}
                                >
                                    −
                                </button>
                                <input
                                    id="product-quantity"
                                    className="product__count__input"
                                    type="number"
                                    min={1}
                                    step={1}
                                    inputMode="numeric"
                                    value={qty}
                                    onChange={(e) => {
                                        const {value} = e.target;
                                        if (value === '') {
                                            setQty('');
                                            return;
                                        }

                                        setQty(normalizeQuantity(value));
                                    }}
                                    onBlur={() => setQty(normalizedQty)}
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                                <button
                                    type="button"
                                    className="product__quantity__button"
                                    aria-label="Збільшити кількість"
                                    onClick={() => setQty(normalizeQuantity(normalizedQty + 1))}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {normalizedQty > 1 && (
                            <p className="product__page__total__sum">
                                Разом за {normalizedQty} шт.: <strong>{sum}</strong> грн
                            </p>
                        )}

                        <div className="product__page__btn__container">
                            <button
                                type="button"
                                className="product__page__btn"
                                onClick={handleAddToCart}
                                disabled={!isPurchasable}
                            >
                                {!isPurchasable ? 'Товар тимчасово недоступний' : 'Додати в кошик'}
                            </button>
                            {isPurchasable && (
                                <p className="product__page__btn__hint">
                                    Після оформлення ми опрацюємо ваше замовлення і підтвердимо його за допомогою дзвінка або повідомлення.
                                </p>
                            )}
                        </div>
                    </div>
                </Col>

                <Col xs={12} md={3}>
                    <div className="purchase__conditions__card">
                        <p className="purchase__conditions__badge">Безкоштовна доставка від 1500 грн</p>

                        <div className="purchase__conditions__section">
                            <h6>Доставка</h6>
                            <p className="purchase__conditions__text">
                                Нова пошта: відділення, поштомат або кур’єр.
                            </p>
                            <Link className="purchase__conditions__link" to={DELIVERY_PAYMENT_ROUTE}>
                                Детальніше про доставку й оплату
                            </Link>
                        </div>

                        <div className="purchase__conditions__section">
                            <h6>Оплата</h6>
                            <p className="purchase__conditions__text">
                                Післяплата Новою поштою або передоплата після підтвердження замовлення.
                            </p>
                        </div>

                        <div className="purchase__conditions__section">
                            <h6>Повернення</h6>
                            <p className="purchase__conditions__text">
                                Повернення протягом 14 днів.
                            </p>
                            <Link className="purchase__conditions__link" to={RETURN_POLICY_ROUTE}>
                                Умови повернення
                            </Link>
                        </div>

                        <div className="purchase__conditions__section">
                            <h6>Консультація</h6>
                            <p className="purchase__conditions__text">
                                Допоможемо погодити розмір і колір.
                            </p>
                            <button
                                type="button"
                                className="purchase__conditions__callback__link"
                                onClick={() => setShowCallback(true)}
                            >
                                Отримати консультацію
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="product__details__row">
                <Col xs={12} md={7}>
                    <div className="product__content__card">
                        <h4>Опис товару</h4>
                        <p className="product__description">{product.description || 'Немає опису'}</p>
                    </div>
                </Col>

                <Col xs={12} md={5}>
                    {characteristics.length > 0 && (
                        <div className="product__content__card product__characteristics">
                            <h4>Характеристики</h4>
                            <div className="product__characteristics__table">
                                {characteristics.map((item) => (
                                    <div
                                        key={item.label}
                                        className="product__characteristics__row"
                                    >
                                        <span className="product__characteristics__label">{item.label}</span>
                                        <span className="product__characteristics__value">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Col>
            </Row>

            <Row className="product__reviews__row">
                <Col xs={12}>
                    <div className="product__content__card product__reviews__card">
                        {product.id && (
                            <Reviews
                                productId={product.id}
                                isAuth={userStore.isAuth}
                                isAdmin={userStore.isAuth && userStore.user?.role === 'ADMIN'}
                                userId={userStore.user?.id}
                            />
                        )}
                    </div>
                </Col>
            </Row>

            <CallbackModal
                show={showCallback}
                onClose={() => setShowCallback(false)}
            />

            <Modal
                show={lightboxOpen}
                onHide={closeLightbox}
                centered
                size="lg"
                contentClassName="bg-transparent border-0"
            >
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
                    >
                        ‹
                    </button>

                    <img
                        src={(product.images?.[lightboxIndex]?.url) || product.img}
                        alt={imageAlt}
                        style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain' }}
                    />

                    <button
                        onClick={lbNext}
                        aria-label="Наступне"
                        className="btn btn-light"
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
                    >
                        ›
                    </button>
                </div>

                {product.images?.length > 1 && (
                    <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
                        {product.images.map((im, i) => (
                            <img
                                key={i}
                                src={im.url}
                                alt=""
                                onClick={() => setLightboxIndex(i)}
                                style={{
                                    width: 64,
                                    height: 64,
                                    objectFit: 'cover',
                                    cursor: 'pointer',
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