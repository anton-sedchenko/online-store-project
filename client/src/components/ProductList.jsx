import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {Col, Row} from "react-bootstrap";
import ProductItem from "./ProductItem.jsx";

const ProductList = observer(({products}) => {
    const {productStore} = useContext(Context);
    const list = Array.isArray(products)
        ? products
        : productStore.products;

    return (
        <Row className="gallery">
            {list.map(product =>
                <Col
                    xs={12}    /* до 576px — 1 колонка */
                    sm={6}     /* 576–767 — 2 колонки */
                    md={6}     /* 768–991 — 2 колонки */
                    lg={4}     /* 992–1199 — 3 колонки (12/4=3) */
                    xl={3}     /* від 1200px — 4 колонки (12/3=4) */
                    key={product.id}
                    className="gallery__row"
                >
                    <ProductItem product={product}/>
                </Col>
            )}
        </Row>
    );
});

export default ProductList;