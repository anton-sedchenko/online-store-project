import React, {useContext} from 'react';
import {Context} from "../main.jsx";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {ADMIN_ROUTE, CART_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts.js";
import CartIcon from "./UI/CartIcon.jsx";
import LoginIcon from "./UI/LoginIcon.jsx";

const Header = observer(() => {
    const {userStore, cartStore} = useContext(Context);
    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem("token");
        userStore.setUser({})
        userStore.setIsAuth(false);
        // Перемикаємось на кошик гостя
        cartStore.switchToGuest();
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
                <div className="header__nav__tel">
                    <p>
                        <i className="fa fa-phone contacts__icon" aria-hidden="true"></i>
                        +38 (068) 036 15 97
                    </p>
                </div>
                <div className="header__nav__menu">
                    {userStore.isAuth ? (
                        <>
                            <Link to="/profile" className="header__link">
                                <button className="btn btn-light">
                                    Мій профіль
                                </button>
                            </Link>

                            {userStore.isAuth && userStore.user.role === "ADMIN" && (
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
                                <button className="btn btn-light header__login__btn">
                                    <LoginIcon />
                                </button>
                            </Link>
                        </>
                    )}
                    <Link to={CART_ROUTE} className="header__cart">
                        <button className="btn btn-light header__cart-btn">
                            <CartIcon/>
                        </button>
                    </Link>
                </div>
            </nav>
        </header>
    );
});

export default Header;
