import React, {useContext} from 'react';
import {Context} from "../main.jsx";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {ADMIN_ROUTE, CART_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts.js";
import CartIcon from "./UI/CartIcon.jsx";
import LoginIcon from "./UI/LoginIcon.jsx";
import UserIcon from "./UI/UserIcon.jsx";
import AdminPanelLogo from "./UI/AdminPanelLogo.jsx";

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
            <div className="header__content">
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
                                <div className="header__btn__container">
                                    <Link to="/profile" className="header__link">
                                        <button className="neu-btn header__btn">
                                            <UserIcon />
                                            <p>Кабінет</p>
                                        </button>
                                    </Link>
                                </div>

                                {userStore.isAuth && userStore.user.role === "ADMIN" && (
                                    <div className="header__btn__container">
                                        <button
                                            className="neu-btn header__btn"
                                            onClick={() => navigate(ADMIN_ROUTE)}
                                        >
                                            <AdminPanelLogo />
                                            <p>Адмін панель</p>
                                        </button>
                                    </div>
                                )}

                                <div className="header__btn__container">
                                    <button
                                        className="neu-btn header__btn"
                                        onClick={() => logOut()}
                                    >
                                        <LoginIcon />
                                        <p>Вийти</p>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="header__btn__container">
                                <Link to={REGISTRATION_ROUTE} className="header__link">
                                    <button className="neu-btn header__btn">
                                        <LoginIcon />
                                        <p>Увійти</p>
                                    </button>
                                </Link>
                            </div>
                        )}
                        <div className="header__btn__container">
                            <Link to={CART_ROUTE} className="header__link">
                                <button className="neu-btn header__btn">
                                    <CartIcon/>
                                    <p>Кошик</p>
                                </button>
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
});

export default Header;
