import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import SideBar from "../components/SideBar.jsx";
import TypeBar from "../components/TypeBar.jsx";
import FigureList from "../components/FigureList.jsx";

const Shop = () => {
    return (
        <Container fluid>
            <Row>
                <Col md={2}>
                    <SideBar/>
                </Col>
                <Col md={10}>
                    <div className="gallery__title">
                        <h2>Наші вироби ручної роботи, виготовлені з любов'ю <i className="fa-solid fa-heart"></i></h2>
                    </div>
                    <TypeBar/>
                    <FigureList/>
                </Col>
            </Row>
        </Container>
    );
};

export default Shop;
