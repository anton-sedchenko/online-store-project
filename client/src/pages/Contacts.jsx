import React from 'react';
import SideBar from "../components/SideBar.jsx";
import {Col, Container, Row} from "react-bootstrap";
import {Helmet} from "react-helmet-async";

const Contacts = () => {
    return (
        <div className="component__container">
            <Helmet>
                <title>Контакти – Чарівна майстерня</title>
                <meta name="description" content="Зв’яжіться з нами для консультації чи індивідуального замовлення." />
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
                                    <p>Телефон:</p>
                                    <p>
                                        <i className="fa fa-phone contacts__icon" aria-hidden="true"></i>
                                        <span>+38 (068) 036 15 97</span>
                                        <span>+38 (093) 744 25 11</span>
                                        <span>+38 (050) 608 62 30</span>
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p>E-mail:</p>
                                    <p>
                                        <i className="fa fa-envelope-o contacts__icon" aria-hidden="true"></i>
                                        charivnij.workshop@gmail.com
                                    </p>
                                </Col>
                            </Row>
                            <div className="contacts__info__block contacts__graphic__block">
                                <h4>Графік роботи:</h4>
                                <p>
                                    <i className="fa fa-clock-o contacts__icon" aria-hidden="true"></i>
                                    <strong>З 10:00 до 19:00.</strong>
                                </p>
                                <p>
                                    <i className="fa fa-calendar contacts__icon" aria-hidden="true"></i>
                                    <strong>Неділя - вихідний.</strong>
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
                                    +38 (068) 036 15 97
                                </p>
                                <p>
                                    <i className="fa fa-envelope-o contacts__icon" aria-hidden="true"></i>
                                    charivnij.workshop@gmail.com
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