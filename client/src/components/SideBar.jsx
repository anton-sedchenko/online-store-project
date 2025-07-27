import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import ProductsCounter from "./UI/ProductsCounter.jsx";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";
import MobileMenuModal from "./modals/MobileMenuModal.jsx";

const SideBar = observer(() => {
    const {userStore} = useContext(Context);
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <>
            <aside className="sidebar__aside__wrapper">
                <div className="sidebar__menu__container">
                    <button
                        className="neu-btn header__btn"
                        onClick={() => setMenuVisible(true)}
                    >
                        Меню
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
        </>
    );
});

export default SideBar;
