import React from 'react';
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <div className="footer__content">
                <div className="footer__links-container">
                    <div className="footer__column-links">
                        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                            Блог
                        </Link>
                        <Link to="/shop" onClick={() => window.scrollTo(0, 0)}>
                            Каталог
                        </Link>
                        <Link to="/contacts" onClick={() => window.scrollTo(0, 0)}>
                            Контакти
                        </Link>
                        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                            Публічний договір
                        </Link>
                    </div>
                    <div className="footer__column-contacts">
                        {/*<p>Ми у соціальних мережах</p>*/}
                        {/*<p>FB icon, Insta icon, Tik-Tok icon</p>*/}
                        <p>+38 (068) 036 15 97</p>
                        <p>+38 (093) 744 25 11</p>
                        <p>+38 (050) 608 62 30</p>
                        <p>charivnij.workshop@gmail.com</p>
                    </div>
                </div>
                <div className="footer__copyrights-container">
                    <div className="footer__column-copyrights">
                        <p>Чарівна майстерня &copy;2025</p>
                        <p>Developed by Anton Sedchenko</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;