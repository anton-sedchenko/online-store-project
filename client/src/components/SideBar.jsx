import React from 'react';
import {FIGURE_ROUTE} from "../utils/consts.js";
import {Link} from "react-router-dom";
import CartIcon from "./UI/CartIcon.jsx";
import GoodsCounter from "./UI/GoodsCounter.jsx";

const SideBar = () => {
    return (
        <aside>
            <div className="sidebar">
                <div className="sidebar__tools-container">
                    <ul className="sidebar__tools-list">
                        <li className="sidebar__tools-list-item">
                            <Link to="/">Галерея</Link>
                        </li>
                        <li className="sidebar__tools-list-item">
                            <a href="#">Мій профіль</a>
                        </li>
                        <li className="sidebar__tools-list-item">
                            <Link to="/cart">Мій кошик</Link>
                            <GoodsCounter/>
                        </li>
                        <li className="sidebar__tools-list-item">
                            <Link to="/contacts">Контакти</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;
