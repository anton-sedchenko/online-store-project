import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import ProductsCounter from "./UI/ProductsCounter.jsx";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";

const SideBar = observer(() => {
    const {userStore} = useContext(Context);

    return (
        <>
            <aside className="sidebar__aside__wrapper">
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
                            <Link to="/blog">Блог</Link>
                        </li>
                        <li className="neu-btn sidebar__nav__item">
                            <Link to="/contacts">Контакти</Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
});

export default SideBar;
