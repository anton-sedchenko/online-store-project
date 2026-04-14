import React, { useContext, useState } from 'react';
import { Context } from "../main.jsx";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
    ADMIN_ROUTE,
    CART_ROUTE,
    HOME_ROUTE,
    REGISTRATION_ROUTE
} from "../utils/consts.js";

import CartIcon from "./UI/CartIcon.jsx";
import LoginIcon from "./UI/LoginIcon.jsx";
import AdminPanelLogo from "./UI/AdminPanelLogo.jsx";
import MenuIcon from "./UI/MenuIcon.jsx";
import MobileMenuModal from "./modals/MobileMenuModal.jsx";

const Header = observer(() => {
    const { userStore, cartStore } = useContext(Context);
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);

    const logOut = async () => {
        if (userStore.isAuth) {
            try {
                await cartStore.clearCart();
            } catch (_) {
                // ignore
            }
        }

        localStorage.removeItem("token");
        userStore.setUser({});
        userStore.setIsAuth(false);

        localStorage.removeItem("guestCart");
        cartStore.switchToGuest();

        navigate(HOME_ROUTE);
    };

    return (
        <header className="header mb-4">
            <div className="header__content__wrapper">
                <picture className="header__bg">
                    <source srcSet="/header-basket-mobile.webp" media="(max-width: 767px)" />
                    <img
                        src="/header-basket.webp"
                        alt=""
                        className="header__bg__image"
                        loading="eager"
                        fetchPriority="high"
                    />
                </picture>

                <div className="header__content">
                    <div className="header__logo-container">
                        <Link to="/">
                            <img src="/logo.png" className="header__logo" alt="Charivna Craft" />
                        </Link>
                    </div>

                    <nav className="header__nav">
                        <div className="header__nav__menu">
                            {userStore.isAuth ? (
                                <>
                                    {userStore.user?.role === "ADMIN" && (
                                        <div className="header__btn__container header__btn__container--desktop-only">
                                            <button
                                                type="button"
                                                className="header__btn"
                                                onClick={() => navigate(ADMIN_ROUTE)}
                                            >
                                                <AdminPanelLogo />
                                                <span>Адмін панель</span>
                                            </button>
                                        </div>
                                    )}

                                    <div className="header__btn__container header__btn__container--desktop-only">
                                        <button
                                            type="button"
                                            className="header__btn"
                                            onClick={logOut}
                                        >
                                            <LoginIcon />
                                            <span>Вийти</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="header__btn__container header__btn__container--desktop-only">
                                    <Link to={REGISTRATION_ROUTE} className="header__btn header__link-btn">
                                        <LoginIcon />
                                        <span>Увійти</span>
                                    </Link>
                                </div>
                            )}

                            <div className="header__btn__container header__btn__container--mobile-only">
                                <button
                                    type="button"
                                    className="header__btn"
                                    onClick={() => setMenuVisible(true)}
                                >
                                    <MenuIcon />
                                    <span>Меню</span>
                                </button>
                            </div>

                            <div className="header__btn__container header__btn__container--mobile-priority">
                                <Link to={CART_ROUTE} className="header__btn header__link-btn">
                                    <CartIcon />
                                    <span>Кошик</span>
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            <MobileMenuModal
                show={menuVisible}
                onHide={() => setMenuVisible(false)}
            />
        </header>
    );
});

export default Header;