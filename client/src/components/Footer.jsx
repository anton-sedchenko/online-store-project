import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer__container">
            <Row className="footer__links-container">
                <Col md={6} className="footer__column-links">
                    <Link to="/">Блог</Link>
                    <Link to="/">Каталог</Link>
                    <Link to="/">Контакти</Link>
                    <Link to="/">Публічний договір</Link>
                </Col>
                <Col md={6} className="footer__column-contacts">
                    <p>Ми у соціальних мережах</p>
                    <p>FB icon, Insta icon, Tik-Tok icon</p>
                    <p>+38 (068) 036-15-97</p>
                    <p>magic.workshop@gmail.com</p>
                </Col>
            </Row>
            <Row className="footer__copyrights-container">
                <Col md={4} className="footer__column-copyrights">
                    <p>&copy; Created by Anton Sedchenko, 2025</p>
                </Col>
            </Row>
        </footer>
    );
};

export default Footer;