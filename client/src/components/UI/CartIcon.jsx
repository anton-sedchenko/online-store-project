import React from 'react';
import ProductsCounter from "./ProductsCounter.jsx";

const CartIcon = () => {
    return (
        <div className="header__cart__icon-container">
            <i className="fa fa-shopping-cart" />
            <ProductsCounter/>
        </div>
    );
};

export default CartIcon;
