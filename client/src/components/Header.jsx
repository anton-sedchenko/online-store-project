import React, {useContext, useState} from 'react';
import {Context} from "../main.jsx";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {ADMIN_ROUTE, CART_ROUTE, HOME_ROUTE, REGISTRATION_ROUTE} from "../utils/consts.js";
import CartIcon from "./UI/CartIcon.jsx";
import LoginIcon from "./UI/LoginIcon.jsx";
import UserIcon from "./UI/UserIcon.jsx";
import AdminPanelLogo from "./UI/AdminPanelLogo.jsx";
import MobileMenuModal from "./modals/MobileMenuModal.jsx";

const Header = observer(() => {
    const {userStore, cartStore} = useContext(Context);
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);

    const logOut = () => {
        localStorage.removeItem("token");
        userStore.setUser({})
        userStore.setIsAuth(false);
        // Перемикаємось на кошик гостя
        cartStore.switchToGuest();
        navigate(HOME_ROUTE);
    }

    return (
        <header className="header">
            <div className="header__content">
                <div className="header__logo-container">
                    <Link to="/">
                        <img src="/logo.png" className="header__logo" alt="logo"/>
                    </Link>
                </div>

                <nav className="header__nav">
                    <div className="header__nav__tel">
                        <div>
                            <span>+38 (068) 036 15 97</span>
                        </div>
                        <div>
                            <span>+38 (093) 744 25 11</span>
                        </div>
                        <div>
                            <span>+38 (050) 608 62 30</span>
                        </div>
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

                                {userStore.isAuth && userStore.user?.role === "ADMIN" && (
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

                        <div className="header__btn__container header__menu__btn__container">
                            <button
                                className="neu-btn header__btn"
                                onClick={() => setMenuVisible(true)}
                            >
                                Меню
                            </button>
                        </div>

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

            <MobileMenuModal
                show={menuVisible}
                onHide={() => setMenuVisible(false)}
            />
        </header>
    );
});

export default Header;
