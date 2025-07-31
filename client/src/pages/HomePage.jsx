import React from 'react';
import {Row, Col} from 'react-bootstrap';
import {Helmet} from 'react-helmet-async';
import SideBar from '../components/SideBar.jsx';
import CategoryList from '../components/CategoryList.jsx';

const HomePage = () => (
    <>
        <Helmet>
            <title>Категорії – Charivna Craft</title>
        </Helmet>
        <div className="component__container">
            <Row>
                <Col md={3} lg={2}>
                    <SideBar/>
                </Col>
                <Col md={9} lg={10}>
                    <h2 className="mb-4">Каталог</h2>
                    <CategoryList/>
                </Col>
            </Row>
        </div>
    </>
);

export default HomePage;