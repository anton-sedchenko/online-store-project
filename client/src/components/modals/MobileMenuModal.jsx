import React, { useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ProductsCounter from '../UI/ProductsCounter.jsx';
import { Context } from '../../main.jsx';
import {
    ADMIN_ROUTE,
    BLOG_ROUTE,
    CART_ROUTE,
    CONTACTS_ROUTE,
    HOME_ROUTE,
    PROFILE_ROUTE,
    REGISTRATION_ROUTE,
} from '../../utils/consts.js';

const MobileMenuModal = observer(({ show, onHide }) => {
    const { userStore, cartStore } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (userStore.isAuth) {
            try {
                await cartStore.clearCart();
            } catch (_) {
                // ignore
            }
        }

        localStorage.removeItem('token');
        userStore.setUser({});
        userStore.setIsAuth(false);

        localStorage.removeItem('guestCart');
        cartStore.switchToGuest();

        onHide();
        navigate(HOME_ROUTE);
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="mobile-menu-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Меню</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <ul className="modal__menu">
                    <li>
                        <Link to={HOME_ROUTE} onClick={onHide}>
                            Галерея
                        </Link>
                    </li>

                    {userStore.isAuth && (
                        <li>
                            <Link to={PROFILE_ROUTE} onClick={onHide}>
                                Мій профіль
                            </Link>
                        </li>
                    )}

                    <li>
                        <Link to={CART_ROUTE} onClick={onHide}>
                            <span>Мій кошик</span>
                            <ProductsCounter />
                        </Link>
                    </li>

                    <li>
                        <Link to={BLOG_ROUTE} onClick={onHide}>
                            Блог
                        </Link>
                    </li>

                    <li>
                        <Link to={CONTACTS_ROUTE} onClick={onHide}>
                            Контакти
                        </Link>
                    </li>

                    {!userStore.isAuth && (
                        <li>
                            <Link to={REGISTRATION_ROUTE} onClick={onHide}>
                                Увійти
                            </Link>
                        </li>
                    )}

                    {userStore.isAuth && userStore.user?.role === 'ADMIN' && (
                        <li>
                            <Link to={ADMIN_ROUTE} onClick={onHide}>
                                Адмін панель
                            </Link>
                        </li>
                    )}

                    {userStore.isAuth && (
                        <li>
                            <button
                                type="button"
                                className="modal__menu__logout"
                                onClick={handleLogout}
                            >
                                Вийти
                            </button>
                        </li>
                    )}
                </ul>
            </Modal.Body>
        </Modal>
    );
});

export default MobileMenuModal;