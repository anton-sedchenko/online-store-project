import React from 'react';
import {Link} from "react-router-dom";
import {
    CONTACTS_ROUTE,
    DELIVERY_PAYMENT_ROUTE,
    OFERTA_ROUTE,
    RETURN_POLICY_ROUTE,
    HOME_ROUTE, PRIVACY_ROUTE, BLOG_ROUTE
} from "../utils/consts.js";

const Footer = () => {
    return (
        <footer>
            <div className="footer__content">
                <div className="footer__links-container">
                    <div className="footer__column-links">
                        <Link to={BLOG_ROUTE}>
                            Блог
                        </Link>
                        <Link to={HOME_ROUTE}>
                            Каталог
                        </Link>
                        <Link to={CONTACTS_ROUTE}>
                            Контакти
                        </Link>
                        <Link to={DELIVERY_PAYMENT_ROUTE}>
                            Доставка і оплата
                        </Link>
                        <Link to={OFERTA_ROUTE}>
                            Публічний договір
                        </Link>
                        <Link to={PRIVACY_ROUTE}>
                            Політика конфіденційності
                        </Link>
                        <Link to={RETURN_POLICY_ROUTE}>
                            Політика повернення товару
                        </Link>
                    </div>
                    <div className="footer__column-contacts">
                        <div className="footer__contact__container">
                            <a
                                href="https://www.facebook.com/charivna.craft"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__social-link"
                            >
                                <i className="fa fa-facebook-square"
                                   aria-hidden="true"></i>
                            </a>
                            <a
                                href="https://www.instagram.com/charivnacraft/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__social-link"
                            >
                                <i className="fa fa-instagram" aria-hidden="true"></i>
                            </a>
                        </div>
                        <div className="footer__contact__container">
                            <a href="tel:+380680361597">+38 (068) 036 15 97</a>
                            <p>Менеджер Viber/Telegram</p>
                        </div>
                        <div className="footer__contact__container">
                            <a href="mailto:charivna.craft@gmail.com">charivna.craft@gmail.com</a>
                        </div>
                    </div>
                </div>
                <div className="footer__copyrights-container">
                    <div className="footer__column-copyrights">
                        <p>Charivna Craft &copy;2025</p>
                        <p>Developed by Anton Sedchenko</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;