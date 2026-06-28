import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Col, Row} from "react-bootstrap";
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

    const galleryImages = useMemo(() => {
        const urls = [
            product.img,
            ...(Array.isArray(product.images)
                ? product.images.map((image) => image?.url)
                : []),
        ].filter(Boolean);

        return [...new Set(urls)];
    }, [product.img, product.images]);

    const galleryImagesCount = galleryImages.length;
    const hasMultipleImages = galleryImagesCount > 1;
    const activeImage = galleryImages[currentImageIndex] || product.img;
    const lightboxImage = galleryImages[lightboxIndex] || activeImage;
    const mainImageTriggerRef = useRef(null);
    const lightboxCloseButtonRef = useRef(null);
    const thumbnailRefs = useRef([]);
    const lightboxThumbnailRefs = useRef([]);
    const touchStartRef = useRef({x: 0, y: 0});
    const didSwipeRef = useRef(false);

    const getScrollBehavior = useCallback(() => {
        if (typeof window === 'undefined') return 'smooth';
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    }, []);

    const goToPreviousImage = useCallback((setter = setCurrentImageIndex) => {
        if (galleryImagesCount <= 1) return;
        setter((prev) => (prev <= 0 ? galleryImagesCount - 1 : prev - 1));
    }, [galleryImagesCount]);

    const goToNextImage = useCallback((setter = setCurrentImageIndex) => {
        if (galleryImagesCount <= 1) return;
        setter((prev) => (prev >= galleryImagesCount - 1 ? 0 : prev + 1));
    }, [galleryImagesCount]);

    const handlePrev = useCallback(() => {
        goToPreviousImage(setCurrentImageIndex);
    }, [goToPreviousImage]);

    const handleNext = useCallback(() => {
        goToNextImage(setCurrentImageIndex);
    }, [goToNextImage]);

    const openLightbox = useCallback((index) => {
        const safeIndex = Math.min(Math.max(index, 0), Math.max(galleryImagesCount - 1, 0));
        setLightboxIndex(safeIndex);
        setLightboxOpen(true);
    }, [galleryImagesCount]);

    const closeLightbox = useCallback(() => {
        setCurrentImageIndex((prev) => (
            galleryImagesCount > 0
                ? Math.min(lightboxIndex, galleryImagesCount - 1)
                : prev
        ));
        setLightboxOpen(false);
    }, [galleryImagesCount, lightboxIndex]);

    const handleLightboxExited = useCallback(() => {
        mainImageTriggerRef.current?.focus();
    }, []);

    const lbPrev = useCallback(() => {
        goToPreviousImage(setLightboxIndex);
    }, [goToPreviousImage]);

    const lbNext = useCallback(() => {
        goToNextImage(setLightboxIndex);
    }, [goToNextImage]);

    useEffect(() => {
        setCurrentImageIndex(0);
        setLightboxIndex(0);
    }, [product.id]);

    useEffect(() => {
        if (galleryImagesCount === 0) return;
        setCurrentImageIndex((index) => Math.min(index, galleryImagesCount - 1));
        setLightboxIndex((index) => Math.min(index, galleryImagesCount - 1));
    }, [galleryImagesCount]);

    useEffect(() => {
        const element = thumbnailRefs.current[currentImageIndex];
        element?.scrollIntoView({
            behavior: getScrollBehavior(),
            block: 'nearest',
            inline: 'nearest',
        });
    }, [currentImageIndex, getScrollBehavior]);

    useEffect(() => {
        if (!lightboxOpen) return;

        lightboxCloseButtonRef.current?.focus();
    }, [lightboxOpen]);

    useEffect(() => {
        if (!lightboxOpen) return;

        const element = lightboxThumbnailRefs.current[lightboxIndex];
        element?.scrollIntoView({
            behavior: getScrollBehavior(),
            block: 'nearest',
            inline: 'nearest',
        });
    }, [getScrollBehavior, lightboxIndex, lightboxOpen]);

    useEffect(() => {
        if (!lightboxOpen) return;

        const onKey = (e) => {
            if (e.key === 'ArrowLeft' && hasMultipleImages) {
                e.preventDefault();
                lbPrev();
            }

            if (e.key === 'ArrowRight' && hasMultipleImages) {
                e.preventDefault();
                lbNext();
            }
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [hasMultipleImages, lbNext, lbPrev, lightboxOpen]);

    const handleTouchStart = (event) => {
        if (!hasMultipleImages) return;
        const touch = event.touches[0];
        touchStartRef.current = {x: touch.clientX, y: touch.clientY};
        didSwipeRef.current = false;
    };

    const handleTouchEnd = (event) => {
        if (!hasMultipleImages) return;
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        const isHorizontalSwipe = Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY);

        if (!isHorizontalSwipe) return;

        didSwipeRef.current = true;
        if (deltaX < 0) {
            handleNext();
        } else {
            handlePrev();
        }
    };

    const handleMainImageClick = () => {
        if (didSwipeRef.current) {
            didSwipeRef.current = false;
            return;
        }

        openLightbox(currentImageIndex);
    };

    const isPurchasable = isPurchasableAvailability(product.availability);

    const normalizedQty = normalizeQuantity(qty);

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

    const unitPrice = Number(product.price || 0);
    const sum = unitPrice * normalizedQty;
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

    const schemaImages = galleryImages;

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
                        <div
                            className="product__gallery__stage"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            {activeImage && (
                                <button
                                    ref={mainImageTriggerRef}
                                    type="button"
                                    className="product__gallery__trigger"
                                    aria-label={`Відкрити збільшене фото ${currentImageIndex + 1} з ${galleryImagesCount}`}
                                    onClick={handleMainImageClick}
                                >
                                    <img
                                        className="product__gallery__image"
                                        src={activeImage}
                                        alt={imageAlt}
                                    />
                                </button>
                            )}

                            {hasMultipleImages && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        className="product__gallery__arrow product__gallery__arrow--prev"
                                        aria-label="Попереднє фото"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="product__gallery__arrow product__gallery__arrow--next"
                                        aria-label="Наступне фото"
                                    >
                                        ›
                                    </button>
                                </>
                            )}

                            {galleryImagesCount > 0 && (
                                <span className="product__gallery__counter" aria-live="polite">
                                    {currentImageIndex + 1} / {galleryImagesCount}
                                </span>
                            )}
                        </div>

                        {hasMultipleImages && (
                            <div className="product__gallery__thumbnails" aria-label="Мініатюри фото товару">
                                {galleryImages.map((imageUrl, index) => (
                                    <button
                                        key={imageUrl}
                                        ref={(element) => {
                                            thumbnailRefs.current[index] = element;
                                        }}
                                        type="button"
                                        className="product__gallery__thumbnail"
                                        aria-label={`Показати фото ${index + 1} з ${galleryImagesCount}`}
                                        aria-pressed={index === currentImageIndex}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`${product.name || 'Товар'}, фото ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
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
                onExited={handleLightboxExited}
                centered
                size="lg"
                contentClassName="product-gallery-lightbox"
                aria-labelledby="product-gallery-lightbox-title"
            >
                <div className="product-gallery-lightbox__content">
                    <h2 id="product-gallery-lightbox-title" className="visually-hidden">
                        Галерея товару: {product.name}
                    </h2>

                    <button
                        ref={lightboxCloseButtonRef}
                        type="button"
                        className="product-gallery-lightbox__close"
                        aria-label="Закрити галерею"
                        onClick={closeLightbox}
                    >
                        ×
                    </button>

                    <div className="product-gallery-lightbox__stage">
                        {hasMultipleImages && (
                            <button
                                type="button"
                                className="product-gallery-lightbox__arrow product-gallery-lightbox__arrow--prev"
                                aria-label="Попереднє фото"
                                onClick={lbPrev}
                            >
                                ‹
                            </button>
                        )}

                        {lightboxImage && (
                            <img
                                className="product-gallery-lightbox__image"
                                src={lightboxImage}
                                alt={`${imageAlt}, фото ${lightboxIndex + 1}`}
                            />
                        )}

                        {hasMultipleImages && (
                            <button
                                type="button"
                                className="product-gallery-lightbox__arrow product-gallery-lightbox__arrow--next"
                                aria-label="Наступне фото"
                                onClick={lbNext}
                            >
                                ›
                            </button>
                        )}

                        {galleryImagesCount > 0 && (
                            <span className="product-gallery-lightbox__counter" aria-live="polite">
                                {lightboxIndex + 1} / {galleryImagesCount}
                            </span>
                        )}
                    </div>

                    {hasMultipleImages && (
                        <div className="product-gallery-lightbox__thumbnails" aria-label="Мініатюри фото в галереї">
                            {galleryImages.map((imageUrl, index) => (
                                <button
                                    key={imageUrl}
                                    ref={(element) => {
                                        lightboxThumbnailRefs.current[index] = element;
                                    }}
                                    type="button"
                                    className="product-gallery-lightbox__thumbnail"
                                    aria-label={`Показати фото ${index + 1} з ${galleryImagesCount}`}
                                    aria-pressed={index === lightboxIndex}
                                    onClick={() => setLightboxIndex(index)}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`${product.name || 'Товар'}, фото ${index + 1}`}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ProductPage;