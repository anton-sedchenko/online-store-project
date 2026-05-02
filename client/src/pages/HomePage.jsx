import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

import SideBar from '../components/SideBar.jsx';
import ProductList from '../components/ProductList.jsx';
import PaginationLocal from '../components/PaginationLocal.jsx';
import ProductFilter from '../components/ProductFilter.jsx';
import { fetchProducts } from '../http/productAPI.js';
import MobileFilterModal from '../components/modals/MobileFilterModal';

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedKinds, setSelectedKinds] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const activeFiltersCount = selectedKinds.length + selectedColors.length;
    const limit = 12;

    useEffect(() => {
        const loadHomeProducts = async () => {
            try {
                setLoading(true);

                const data = await fetchProducts(null, 1, 500);
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
                <title>Кошики, корзини та вироби зі шнура ручної роботи – Charivna Craft</title>
                <meta
                    name="description"
                    content="Charivna Craft — кошики, корзини, органайзери, плейсмати, костери, набори та кашпо зі шнура ручної роботи. Виробник стильних виробів для дому з доставкою по Україні."
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
                            Кошики, корзини та вироби зі шнура ручної роботи – Charivna Craft
                        </h1>

                        {loading ? (
                            <div className="d-flex justify-content-center py-5">
                                <Spinner animation="border" />
                            </div>
                        ) : (
                            <>
                                <div className="mobile-filter-bar d-md-none">
                                    <button
                                        type="button"
                                        className="mobile-filter-bar__button"
                                        onClick={() => setShowMobileFilters(true)}
                                    >
                                        Фільтри
                                        {activeFiltersCount > 0 && (
                                            <span className="mobile-filter-bar__count">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {pageProducts.length > 0 ? (
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
                            </>
                        )}
                    </Col>
                </Row>
            </div>

            <MobileFilterModal
                show={showMobileFilters}
                onHide={() => setShowMobileFilters(false)}
                products={allProducts}
                selectedKinds={selectedKinds}
                setSelectedKinds={setSelectedKinds}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
            />
        </>
    );
};

export default HomePage;