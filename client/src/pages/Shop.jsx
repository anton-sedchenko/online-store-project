import React, {useContext, useEffect} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import SideBar from "../components/SideBar.jsx";
import TypeBar from "../components/TypeBar.jsx";
import FigureList from "../components/FigureList.jsx";
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {fetchFigures, fetchTypes} from "../http/figureAPI.js";
import Pages from "../components/Pages.jsx";

const Shop = observer(() => {
    const {figure} = useContext(Context);

    // Підгружаємо товари один раз при відкритті сторінки магазину
    useEffect(() => {
        fetchTypes().then(data => figure.setTypes(data));
    }, []);

    // Завантажуємо фігурки кожного разу, коли змінюється
    // або обраний тип, або номер поточної сторінки
    useEffect(() => {
            fetchFigures(
                figure.selectedType.id || null,
                figure.currentPage,
                figure.figuresLimitOnOnePage
            ).then(data => {
                figure.setFigures(data.rows);
                figure.setFiguresCountOnCurrentRequest(data.rows.length); // кількість отриманих у поточному запиті
                figure.setTotalCount(data.count);                         // загальна кількість за фільтром
            });
    }, [
        figure,                 // стор, від якого слухаємо внутрішні поля
        figure.selectedType,    // коли змінюється тип — перезапит
        figure.currentPage      // коли змінюється сторінка — перезапит
    ]);

    return (
        <Container fluid>
            <Row>
                <Col md={2}><SideBar/></Col>
                <Col md={10}>
                    <div className="gallery__title">
                        <h2>Наші вироби ручної роботи, виготовлені з любов'ю <i className="fa-solid fa-heart"></i></h2>
                    </div>
                    <TypeBar/>
                    <FigureList/>
                    <Pages/>
                </Col>
            </Row>
        </Container>
    );
});

export default Shop;
