import React from 'react';
import SideBar from "../components/SideBar.jsx";
import {Col, Container, Row} from "react-bootstrap";
import {Helmet} from "react-helmet-async";

const Contacts = () => {
    return (
        <div className="component__container">
            <Helmet>
                <title>Контакти – Charivna Craft</title>
                <meta name="description" content="Як з нами зв’язатися" />
                <link rel="canonical" href="https://charivna-craft.com.ua/contacts" />
            </Helmet>

            <Row>
                <Col md={2}>
                    <SideBar/>
                </Col>
                <Col md={9}>
                    <Container className="contacts__container">
                        <div className="contacts__content">
                            <Row className="contacts__info__block contacts__tel__block">
                                <h2>Наші контакти</h2>
                                <Col md={6}>
                                    <p>
                                        <i className="fa fa-phone contacts__icon" aria-hidden="true"></i>
                                        Телефон:
                                    </p>
                                    <div>
                                        <a href="tel:+380680361597">+38 (068) 036 15 97</a>
                                        <p>Менеджер Viber/Telegram</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <p>
                                        <i className="fa fa-envelope-o contacts__icon" aria-hidden="true"></i>
                                        E-mail:
                                    </p>
                                    <p>
                                        <a href="mailto:charivna.craft@gmail.com">charivna.craft@gmail.com</a>
                                    </p>
                                </Col>
                            </Row>
                            <div className="contacts__info__block contacts__graphic__block">
                                <h4>Графік роботи:</h4>
                                <p>
                                    <i className="fa fa-clock-o contacts__icon" aria-hidden="true"></i>
                                    <span>З 10:00 до 19:00.</span>
                                </p>
                                <p>
                                    <i className="fa fa-calendar contacts__icon" aria-hidden="true"></i>
                                    <span>Неділя - вихідний.</span>
                                </p>
                            </div>
                            <div className="contacts__info__block contacts__address__block">
                                <h4>Адреса:</h4>
                                <p>м. Новий Розділ, пр. Тараса Шевченка, 13, Львівська область.</p>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2592.58499789831!2d24.133070976619823!3d49.47345567142208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473a8a1657565e49%3A0xea2a55cab8f2ed6d!2z0L_RgNC-0YHQv9C10LrRgiDQotCw0YDQsNGB0LAg0KjQtdCy0YfQtdC90LrQsCwgMTMsINCd0L7QstC40Lkg0KDQvtC30LTRltC7LCDQm9GM0LLRltCy0YHRjNC60LAg0L7QsdC70LDRgdGC0YwsIDgxNjUy!5e0!3m2!1suk!2sua!4v1750256300515!5m2!1suk!2sua"
                                    style={{border: "0", width: "100%", minWidth: "300px", height: "400px"}} allowFullScreen="" loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                            <div className="contacts__support__block">
                                <h4>Підтримка</h4>
                                <p>Якщо у Вас є запитання чи пропозиції - завжди будемо раді!</p>
                                <p>Звертайтесь:</p>
                                <p>
                                    <i className="fa fa-calendar contacts__icon" aria-hidden="true"></i>
                                    Пн-Сб: 10:00-19:00
                                </p>
                                <p>
                                    <i className="fa fa-phone contacts__icon" aria-hidden="true"></i>
                                    <a href="tel:+380680361597">+38 (068) 036 15 97</a>
                                    <p>Менеджер Viber/Telegram</p>
                                </p>
                                <p>
                                    <i className="fa fa-envelope-o contacts__icon" aria-hidden="true"></i>
                                    <a href="mailto:charivna.craft@gmail.com">charivna.craft@gmail.com</a>
                                </p>
                            </div>
                        </div>
                    </Container>
                </Col>
            </Row>
        </div>
    );
};

export default Contacts;