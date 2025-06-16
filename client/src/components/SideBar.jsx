import React from 'react';
import {FIGURE_ROUTE} from "../utils/consts.js";
import {Link} from "react-router-dom";
import CartIcon from "./CartIcon.jsx";

const SideBar = () => {
    return (
        <aside>
            <div className="sidebar">
                <div className="sidebar__tools-container">
                    <ul className="sidebar__tools-list">
                        <li className="sidebar__tools-list-item">
                            <Link to="/">Головна</Link>
                        </li>
                        <li className="sidebar__tools-list-item">
                            <a href="#">Мій профіль</a>
                        </li>
                        <li className="sidebar__tools-list-item">
                            <CartIcon/>
                            <a href="#" className="sidebar__cart-link">Мій кошик</a>
                        </li>
                        <li className="sidebar__tools-list-item">
                            <a href="#">Контакти</a>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;
