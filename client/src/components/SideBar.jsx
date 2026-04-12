import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import ProductsCounter from "./UI/ProductsCounter.jsx";
import { Context } from "../main.jsx";
import { observer } from "mobx-react-lite";

const SideBar = observer((props) => {
    const { userStore } = useContext(Context);

    return (
        <aside className="sidebar__aside__wrapper">
            <div className="sidebar">
                <div className="sidebar__section">
                    <ul className="sidebar__nav">
                        <li className="sidebar__nav__item">
                            <Link to="/">Каталог</Link>
                        </li>

                        {userStore.isAuth && (
                            <li className="sidebar__nav__item">
                                <Link to="/profile">Мій профіль</Link>
                            </li>
                        )}

                        <li className="sidebar__nav__item">
                            <Link to="/cart">Мій кошик</Link>
                            <ProductsCounter />
                        </li>

                        <li className="sidebar__nav__item">
                            <Link to="/blog">Блог</Link>
                        </li>

                        <li className="sidebar__nav__item">
                            <Link to="/contacts">Контакти</Link>
                        </li>
                    </ul>
                </div>

                {props.children && (
                    <div className="sidebar__section sidebar__section--filters">
                        {props.children}
                    </div>
                )}
            </div>
        </aside>
    );
});

export default SideBar;