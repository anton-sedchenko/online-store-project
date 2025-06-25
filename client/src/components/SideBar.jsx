import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import GoodsCounter from "./UI/GoodsCounter.jsx";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";

const SideBar = observer(() => {
    const {user} = useContext(Context);

    return (
        <aside>
            <div className="sidebar">
                <div className="sidebar__tools-container">
                    <ul>
                        <li className="sidebar__tools-list-item">
                            <Link to="/">Галерея</Link>
                        </li>
                        {user.isAuth &&
                            (<li className="sidebar__tools-list-item">
                                <Link to="/profile">Мій профіль</Link>
                            </li>)
                        }
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
});

export default SideBar;
