import React from 'react';
import {Card, Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {PRODUCT_ROUTE} from "../utils/consts.js";

const ProductItem = ({product}) => {
    const navigate = useNavigate();

    return (
        <>
            <Card
                border={"light"}
                className="gallery__card neu-card"
                onClick={() => navigate(`${PRODUCT_ROUTE}/${product.id}`)}
            >
                <Image
                    src={product.img}
                />
                <p className="gallery__card__product__code">Артикул: {product.code}</p>
                <h6 className="gallery__card__product__name">{product.name}</h6>
                <p className="gallery__card__product__price">Ціна: <span>{product.price}</span> грн.</p>
            </Card>
        </>
    );
};

export default ProductItem;