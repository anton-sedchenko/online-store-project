import React, {useContext} from 'react';
import {Context} from "../main.jsx";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {ADMIN_ROUTE, CART_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts.js";

const Header = observer(() => {
    const {user, isAuth, setIsAuth} = useContext(Context);
    const navigate = useNavigate();

    // Будемо видаляти токен із localStorage
    const handleLogout = () => {
        localStorage.removeItem('token');

    // Оновлюємо стан авторизації
        user.setIsAuth(false);
        navigate('/');
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
                        <button
                            className="btn btn-light"
                            onClick={() => navigate(ADMIN_ROUTE)}
                        >
                            Адмін панель</button>
                        <button
                            onClick={handleLogout}
                            className="btn btn-light header__link"
                            onClick={() => navigate(LOGIN_ROUTE)}
                        >
                            Вийти
                        </button>
                    </>
                ) : (
                    <>
                        <Link to={LOGIN_ROUTE} className="header__link">
                            <button
                                className="btn btn-light"
                                onClick={() => user.setIsAuth(true)}
                            >
                                Увійти
                            </button>
                        </Link>
                        <Link to={REGISTRATION_ROUTE} className="header__link">
                            <button className="btn btn-light">
                                Зареєструватись
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
