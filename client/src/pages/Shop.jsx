import React, {useContext, useEffect} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import SideBar from "../components/SideBar.jsx";
import TypeBar from "../components/TypeBar.jsx";
import ProductList from "../components/ProductList.jsx";
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {fetchProducts} from "../http/productAPI.js";
import Pages from "../components/Pages.jsx";

const Shop = observer(() => {
    const {productStore} = useContext(Context);

    // Підгружаємо товари один раз при відкритті сторінки магазину
    useEffect(() => {
        productStore.fetchTypes();
    }, [productStore]);

    // Завантажуємо фігурки кожного разу, коли змінюється
    // або обраний тип, або номер поточної сторінки
    useEffect(() => {
            fetchProducts(
                productStore.selectedType.id || null,
                productStore.currentPage,
                productStore.productsLimitOnOnePage
            ).then(data => {
                productStore.setProducts(data.rows);
                productStore.setProductsCountOnCurrentRequest(data.rows.length); // кількість отриманих у поточному запиті
                productStore.setTotalCount(data.count);                         // загальна кількість за фільтром
            });
    }, [
        productStore,                 // стор, від якого слухаємо внутрішні поля
        productStore.selectedType,    // коли змінюється тип — перезапит
        productStore.currentPage      // коли змінюється сторінка — перезапит
    ]);

    return (
        <div className="component__container">
            <Row>
                <Col md={2}><SideBar/></Col>
                <Col md={10}>
                    <div className="gallery__title">
                        <h2>Наші вироби ручної роботи, виготовлені з любов'ю <i className="fa-solid fa-heart"></i></h2>
                    </div>
                    <div className="gallery__cookies">
                        <p>Каталог</p>
                    </div>
                    <TypeBar/>
                    <ProductList/>
                    <Pages/>
                </Col>
            </Row>
        </div>
    );
});

export default Shop;
