import React, {useContext, useState} from 'react';
import {Button, Card, Image} from "react-bootstrap";
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
                    <Image
                        src={product.img}
                    />
                    <p className="gallery__card__product__code">Артикул: {product.code}</p>
                    <h6 className="gallery__card__product__name">{product.name}</h6>
                    <p className="gallery__card__product__price">Ціна: <span>{product.price}</span> грн.</p>
                </div>
                <div className="gallery__card__btn__container">
                    <btn
                        className="neu-btn gallery__card__btn"
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