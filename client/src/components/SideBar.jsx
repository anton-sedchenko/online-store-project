import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import ProductsCounter from "./UI/ProductsCounter.jsx";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";
import FilterIcon from "./UI/FilterIcon.jsx";
import MobileMenuModal from "./modals/MobileMenuModal.jsx";
import MobileTypeModal from "./modals/MobileTypeModal.jsx";

const SideBar = observer(() => {
    const {userStore} = useContext(Context);
    const [menuVisible, setMenuVisible] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);

    return (
        <>
            <aside className="sidebar__aside__wrapper">
                <div className="sidebar__menu__container">
                    <button
                        className="neu-btn header__btn sidebar__btn__container"
                        onClick={() => setMenuVisible(true)}
                    >
                        <p>Меню</p>
                    </button>
                    <div className="sidebar__title">
                        <p>Каталог</p>
                    </div>
                    <button
                        className="neu-btn header__btn sidebar__btn__container"
                        onClick={() => setTypeVisible(true)}
                    >
                        <FilterIcon />
                    </button>
                </div>
                <div className="sidebar">
                    <ul>
                        <li className="neu-btn sidebar__nav__item">
                            <Link to="/">Галерея</Link>
                        </li>
                        {userStore.isAuth &&
                            (<li className="neu-btn sidebar__nav__item">
                                <Link to="/profile">Мій профіль</Link>
                            </li>)
                        }
                        <li className="neu-btn sidebar__nav__item">
                            <Link to="/cart">Мій кошик</Link>
                            <ProductsCounter/>
                        </li>
                        <li className="neu-btn sidebar__nav__item">
                            <Link to="/contacts">Контакти</Link>
                        </li>
                    </ul>
                </div>
            </aside>
            <MobileMenuModal
                show={menuVisible}
                onHide={() => setMenuVisible(false)}
            />
            <MobileTypeModal
                show={typeVisible}
                onHide={() => setTypeVisible(false)}
            />
        </>
    );
});

export default SideBar;
