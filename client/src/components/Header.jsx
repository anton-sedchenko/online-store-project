import React, {useContext} from 'react';
import {Context} from "../main.jsx";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {ADMIN_ROUTE, CART_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts.js";

const Header = observer(() => {
    const {user} = useContext(Context);
    const navigate = useNavigate();

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false);
        localStorage.removeItem('token');
        navigate(SHOP_ROUTE);
    }

    return (
        <header className="header">
            <div className="header__logo-container">
                <Link to="/">
                    <img src="../src/img/logo.png" className="header__logo" alt="logo"/>
                </Link>
            </div>

            <nav className="header__nav">
                {user.isAuth ? (
                    <>
                        <Link to="/profile" className="header__link">
                            <button className="btn btn-light">
                                Мій профіль
                            </button>
                        </Link>

                        {user.isAuth && user.user.role === "ADMIN" && (
                            <button
                                className="btn btn-light"
                                onClick={() => navigate(ADMIN_ROUTE)}
                            >
                                Адмін панель
                            </button>
                        )}
                        <button
                            className="btn btn-light header__link"
                            onClick={() => logOut()}
                        >
                            Вийти
                        </button>
                    </>
                ) : (
                    <>
                        <Link to={REGISTRATION_ROUTE} className="header__link">
                            <button className="btn btn-light">
                                Увійти
                            </button>
                        </Link>
                    </>
                )}

                <Link to={CART_ROUTE} className="header__cart">
                    <button className="btn btn-light">
                        Кошик
                    </button>
                </Link>
            </nav>
        </header>
    );
});

export default Header;
