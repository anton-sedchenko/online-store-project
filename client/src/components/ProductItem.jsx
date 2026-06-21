import React, {useContext, useState} from 'react';
import {Card, Image} from "react-bootstrap";
import {Link} from "react-router-dom";
import {PRODUCT_ROUTE} from "../utils/consts.js";
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import AddedToCartModal from "./modals/AddedToCartModal.jsx";
import {getAvailabilityClass, getAvailabilityLabel, isPurchasableAvailability} from "../utils/availability.js";

const ProductItem = observer(({product}) => {
    const {cartStore} = useContext(Context);
    const [showModal, setShowModal] = useState(false);

    const productLink = `${PRODUCT_ROUTE}/${product.slug}`;
    const isPurchasable = isPurchasableAvailability(product.availability);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isPurchasable) return;

        await cartStore.addItem(product);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
    };

    return (
        <>
            <Card
                border={"light"}
                className="gallery__card"
            >
                <Link
                    to={productLink}
                    className="gallery__card__link"
                    aria-label={`Перейти до товару ${product.name}`}
                >
                    <div className="gallery__card__info__container">
                        <div>
                            <Image
                                src={product.img}
                                alt={product.name}
                            />

                            <p className="gallery__card__product__code">
                                Артикул: {product.code}
                            </p>

                            <p className="product__availability">
                                <span className="availability-label">Наявність:</span>{' '}
                                <span className={getAvailabilityClass(product.availability)}>
                                    {getAvailabilityLabel(product.availability)}
                                </span>
                            </p>

                            <h6 className="gallery__card__product__name">
                                {product.name}
                            </h6>
                        </div>

                        <div>
                            <p className="gallery__card__product__price">
                                Ціна: <span>{product.price}</span> грн.
                            </p>
                        </div>
                    </div>
                </Link>

                <div className="gallery__card__btn__container">
                    <button
                        type="button"
                        className="gallery__card__btn"
                        onClick={handleAddToCart}
                        disabled={!isPurchasable}
                    >
                        До кошика
                    </button>
                </div>
            </Card>

            <AddedToCartModal show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
});

export default ProductItem;