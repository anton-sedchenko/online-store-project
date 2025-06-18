import React from 'react';
import GoodsCounter from "./GoodsCounter.jsx";

const CartIcon = () => {
    return (
        <div className="header__cart__icon-container">
            <i className="fa fa-shopping-cart" />
            <GoodsCounter/>
        </div>
    );
};

export default CartIcon;
