import React from 'react';
import {Link} from "react-router-dom";
import {
    CONTACTS_ROUTE,
    DELIVERY_PAYMENT_ROUTE,
    OFERTA_ROUTE,
    RETURN_POLICY_ROUTE,
    HOME_ROUTE
} from "../utils/consts.js";

const Footer = () => {
    return (
        <footer>
            <div className="footer__content">
                <div className="footer__links-container">
                    <div className="footer__column-links">
                        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                            Блог
                        </Link>
                        <Link to={HOME_ROUTE} onClick={() => window.scrollTo(0, 0)}>
                            Каталог
                        </Link>
                        <Link to={CONTACTS_ROUTE} onClick={() => window.scrollTo(0, 0)}>
                            Контакти
                        </Link>
                        <Link to={DELIVERY_PAYMENT_ROUTE} onClick={() => window.scrollTo(0, 0)}>
                            Доставка і оплата
                        </Link>
                        <Link to={OFERTA_ROUTE} onClick={() => window.scrollTo(0, 0)}>
                            Публічний договір
                        </Link>
                        <Link to={RETURN_POLICY_ROUTE} onClick={() => window.scrollTo(0, 0)}>
                            Політика повернення товару
                        </Link>
                    </div>
                    <div className="footer__column-contacts">
                        <p>Наші контакти:</p>
                        <p>
                            <a
                                href="https://www.facebook.com/charivna.craft"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__social-link"
                            >
                                <i className="fa fa-facebook-square" aria-hidden="true"></i>
                            </a>
                        </p>
                        <p>
                            <a href="tel:+380680361597">+38 (068) 036 15 97</a>
                        </p>
                        <p>
                            <a href="tel:+380937442511">+38 (093) 744 25 11</a>
                        </p>
                        <p>
                            <a href="tel:+380506086230">+38 (050) 608 62 30</a>
                        </p>
                        <p>
                            <a href="mailto:charivna-craft@gmail.com">charivna-craft@gmail.com</a>
                        </p>
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