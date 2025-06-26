import React from 'react';
import {Card, Col, Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {PRODUCT_ROUTE} from "../utils/consts.js";

const ProductItem = ({product}) => {
    const navigate = useNavigate();

    return (
        <Col md={3} onClick={() => navigate(`${PRODUCT_ROUTE}/${product.id}`)}>
            <Card
                style={{width: 150, cursor: "pointer", marginBottom: "20px"}}
                border={"light"}
            >
                <Image
                    width={150}
                    height={150}
                    src={`${import.meta.env.VITE_APP_API_URL}${product.img}`}
                />
                <p className="gallery__card__product__code">Артикул: {product.code}</p>
                <h6 className="gallery__card__product__name">{product.name}</h6>
                <p className="gallery__card__product__price">Ціна: <span>{product.price}</span> грн.</p>
            </Card>
        </Col>
    );
};

export default ProductItem;