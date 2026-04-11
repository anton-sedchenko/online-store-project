import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

import SideBar from '../components/SideBar.jsx';
import ProductList from '../components/ProductList.jsx';
import PaginationLocal from '../components/PaginationLocal.jsx';
import { fetchTypes } from '../http/typeAPI.js';
import { fetchProducts } from '../http/productAPI.js';

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 12;

    useEffect(() => {
        const loadHomeProducts = async () => {
            try {
                setLoading(true);

                const types = await fetchTypes();
                const cordCategory = types.find(
                    type => type.name?.trim() === 'Вироби зі шнура'
                );

                if (!cordCategory) {
                    setAllProducts([]);
                    return;
                }

                const data = await fetchProducts(cordCategory.id, 1, 500);
                setAllProducts(data.rows || []);
            } catch (e) {
                console.error('Помилка при завантаженні товарів для головної:', e);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadHomeProducts();
    }, []);

    const totalCount = allProducts.length;
    const startIdx = (currentPage - 1) * limit;
    const pageProducts = allProducts.slice(startIdx, startIdx + limit);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Helmet>
                <title>Вироби зі шнура – Charivna Craft</title>
                <meta
                    name="description"
                    content="Кошики, серветки, підставки та інші вироби зі шнура ручної роботи від Charivna Craft. Стильний декор для дому та затишку."
                />
                <link
                    rel="canonical"
                    href="https://charivna-craft.com.ua/"
                />
                <meta
                    property="og:title"
                    content="Вироби зі шнура – Charivna Craft"
                />
                <meta
                    property="og:description"
                    content="Ручна робота для дому: кошики, підставки, серветки та інші вироби зі шнура від Charivna Craft."
                />
                <meta
                    property="og:url"
                    content="https://charivna-craft.com.ua/"
                />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="component__container">
                <Row>
                    <Col md={3} lg={2}>
                        <SideBar />
                    </Col>

                    <Col md={9} lg={10}>
                        <h1 className="mb-4">Вироби ручної роботи зі шнура – каталог Charivna Craft</h1>

                        {loading ? (
                            <div className="d-flex justify-content-center py-5">
                                <Spinner animation="border" />
                            </div>
                        ) : pageProducts.length > 0 ? (
                            <>
                                <ProductList products={pageProducts} />

                                <PaginationLocal
                                    totalCount={totalCount}
                                    limit={limit}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <p>Товари цієї категорії поки що відсутні.</p>
                        )}
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default HomePage;