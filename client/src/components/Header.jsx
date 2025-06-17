import React, {useContext} from 'react';
import {Context} from "../main.jsx";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {ADMIN_ROUTE, CART_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts.js";
import CartIcon from "./CartIcon.jsx";

const Header = observer(() => {
    const {user, cart} = useContext(Context);
    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem("token");
        user.setUser({})
        user.setIsAuth(false);
        // Перемикаємось на кошик гостя
        cart.switchToGuest();
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
                        <CartIcon/>
                    </button>
                </Link>
            </nav>
        </header>
    );
});

export default Header;
