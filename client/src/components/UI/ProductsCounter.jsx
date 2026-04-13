import React, {useContext} from 'react';
import {Context} from "../../main.jsx";
import {observer} from "mobx-react-lite";

const ProductsCounter = observer(() => {
    const {cartStore} = useContext(Context);
    // кількість товарів з серверного кошика або гостьового із localStorage
    const count = cartStore.totalCount;

    return (
        <div className="goods__counter__container">
            {count > 0 && (
                <span className="goods__counter">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </div>
    );
});

export default ProductsCounter;