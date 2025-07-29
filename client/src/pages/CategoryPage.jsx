import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import {Helmet} from 'react-helmet-async';
import SideBar from '../components/SideBar.jsx';
import {fetchProducts} from '../http/productAPI.js';
import {fetchOneType} from '../http/typeAPI.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import PaginationLocal from '../components/PaginationLocal.jsx';
import ProductList from '../components/ProductList.jsx';

const CategoryPage = () => {
    const {id} = useParams();
    const [products, setProducts] = useState([]);
    const [type, setType] = useState(null);

    //  Локальна пагінація
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 12; // скільки товарів на сторінці
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchOneType(id).then(setType);
        fetchProducts(id, 1, 100).then(data => setProducts(data.rows));
    }, [id]);

    useEffect(() => {
        fetchProducts(id, currentPage, limit).then(data => {
            setProducts(data.rows);
            setTotalCount(data.count);
        });
    }, [id, currentPage]);

    if (!type) return null;

    return (
        <div className="component__container">
            <Row>
                <Col md={3} lg={2}>
                    <SideBar/>
                </Col>
                <Col md={9} lg={10}>
                    <Helmet>
                        <title>{type.name} – Charivna Craft</title>
                        <meta name="description" content={`Всі товари категорії ${type.name}`} />
                    </Helmet>

                    <Breadcrumbs typeId={type.parentId ? type.parentId : type.id} />
                    <h2 className="mb-4">{type.name}</h2>
                    <ProductList products={products} />
                </Col>
            </Row>

            <PaginationLocal
                totalCount={totalCount}
                limit={limit}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default CategoryPage;