import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

import SideBar from '../components/SideBar.jsx';
import ProductList from '../components/ProductList.jsx';
import PaginationLocal from '../components/PaginationLocal.jsx';
import ProductFilter from '../components/ProductFilter.jsx';
import { fetchProducts } from '../http/productAPI.js';

const CORD_TYPE_ID = Number(import.meta.env.VITE_CORD_TYPE_ID);

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedKinds, setSelectedKinds] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    const limit = 12;

    useEffect(() => {
        const loadHomeProducts = async () => {
            try {
                setLoading(true);

                if (!CORD_TYPE_ID) {
                    console.error('CORD_TYPE_ID не заданий');
                    setAllProducts([]);
                    return;
                }

                const data = await fetchProducts(CORD_TYPE_ID, 1, 500);
                setAllProducts(data.rows || []);
            } catch (e) {
                console.error('Помилка при завантаженні товарів:', e);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadHomeProducts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedKinds, selectedColors]);

    const filteredProducts = allProducts.filter(product => {
        if (selectedKinds.length && !selectedKinds.includes(product?.kind)) {
            return false;
        }

        if (selectedColors.length && !selectedColors.includes(product?.color)) {
            return false;
        }

        return true;
    });

    const totalCount = filteredProducts.length;
    const startIdx = (currentPage - 1) * limit;
    const pageProducts = filteredProducts.slice(startIdx, startIdx + limit);

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
                    content="Кошики, серветки, підставки та інші вироби зі шнура ручної роботи від Charivna Craft."
                />
                <link rel="canonical" href="https://charivna-craft.com.ua/" />
            </Helmet>

            <div className="component__container">
                <Row>
                    <Col md={3} lg={2}>
                        <SideBar>
                            <ProductFilter
                                products={allProducts}
                                selectedKinds={selectedKinds}
                                setSelectedKinds={setSelectedKinds}
                                selectedColors={selectedColors}
                                setSelectedColors={setSelectedColors}
                            />
                        </SideBar>
                    </Col>

                    <Col md={9} lg={10}>
                        <h1 className="mb-4">
                            Вироби ручної роботи зі шнура – каталог Charivna Craft
                        </h1>

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
                            <p>За обраними фільтрами товари не знайдено.</p>
                        )}
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default HomePage;