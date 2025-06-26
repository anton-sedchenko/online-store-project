import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {Row} from "react-bootstrap";
import ProductItem from "./ProductItem.jsx";

const ProductList = observer(() => {
    const {productStore} = useContext(Context);

    return (
        <Row className="d-flex gallery">
            {productStore.products.map(product =>
                <ProductItem key={product.id} product={product}/>
            )}
        </Row>
    );
});

export default ProductList;