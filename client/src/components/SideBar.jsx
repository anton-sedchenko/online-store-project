import React from 'react';

const SideBar = () => {
    return (
        <aside>
            <div className="sidebar">
                <div className="sidebar__tools-container">
                    <ul className="sidebar__tools-list">
                        <li className="sidebar__tools-list-item">
                            <a href="#">Галерея</a>
                        </li>
                        <li className="sidebar__tools-list-item">
                            <a href="#">Мій профіль</a>
                        </li>
                        <li className="sidebar__tools-list-item">
                            <a href="#">Мій кошик</a>
                        </li>
                        <li className="sidebar__tools-list-item">
                            <a href="#">Підтримка</a>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;
