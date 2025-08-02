import React, {useContext, useState} from 'react';
import {Card, Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {PRODUCT_ROUTE} from "../utils/consts.js";
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import AddedToCartModal from "./modals/AddedToCartModal.jsx";

const ProductItem = observer(({product}) => {
    const navigate = useNavigate();
    const {cartStore} = useContext(Context);
    const [showModal, setShowModal] = useState(false);

    const handleAddToCart = async () => {
        await cartStore.addItem(product);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
    };

    return (
        <>
            <Card
                border={"light"}
                className="gallery__card neu-card"
                onClick={() => navigate(`${PRODUCT_ROUTE}/${product.slug}`)}
            >
                <div className="gallery__card__info__container">
                    <div>
                        <Image
                            src={product.img}
                        />
                        <p className="gallery__card__product__code">Артикул: {product.code}</p>
                        <p className="product__availability">
                            <span className="availability-label">Наявність:</span>{' '}
                            <span className={
                                product.availability === 'IN_STOCK'
                                    ? 'availability-value in-stock'
                                    : 'availability-value pre-order'
                            }>
                                {product.availability === 'IN_STOCK'
                                    ? 'В наявності'
                                    : 'Під замовлення (2–3 дні)'
                                }
                            </span>
                        </p>
                        <h6 className="gallery__card__product__name">{product.name}</h6>
                    </div>
                    <div>
                        <p className="gallery__card__product__price">Ціна: <span>{product.price}</span> грн.</p>
                    </div>
                </div>
                <div className="gallery__card__btn__container">
                    <btn
                        className="gallery__card__btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart();
                        }}
                    >
                        До кошика
                    </btn>
                </div>
            </Card>

            <AddedToCartModal show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
});

export default ProductItem;