import React, {useContext} from 'react';
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";

const CartIcon = observer(() => {
    const {cart, user} = useContext(Context);
    // кількість товарів з серверного кошика або гостьового із localStorage
    const count = cart.totalCount;

    return (
        <div className="position-relative">
            <i className="fa fa-shopping-cart" />
            {count > 0 && (
                <span
                    className="cart__icon__count__badge badge bg-purple position-absolute top-0 start-100 translate-middle"
                >
                    {count}
                </span>
            )}
        </div>
    );
});

export default CartIcon;
