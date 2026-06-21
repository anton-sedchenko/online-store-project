import React, {useEffect, useMemo, useState} from 'react';
import {Col, Row, Spinner} from 'react-bootstrap';
import {Helmet} from 'react-helmet-async';
import {Link} from 'react-router-dom';

import SideBar from '../components/SideBar.jsx';
import ProductFilter from '../components/ProductFilter.jsx';
import ProductList from '../components/ProductList.jsx';
import PaginationLocal from '../components/PaginationLocal.jsx';
import MobileFilterModal from '../components/modals/MobileFilterModal.jsx';
import {fetchProducts} from '../http/productAPI.js';
import {fetchTypes} from '../http/typeAPI.js';
import {HOME_ROUTE, STORAGE_BASKETS_ROUTE} from '../utils/consts.js';

const PAGE_TITLE = 'Кошики для зберігання';
const PAGE_DESCRIPTION = 'Кошики для зберігання зі шнура ручної роботи від Charivna Craft: для ванної, кухні, дитячої та організації речей вдома.';
const PAGE_URL = 'https://charivna-craft.com.ua/koshyky-dlia-zberihannia';
const limit = 12;

const StorageBasketsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [types, setTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const loadStorageBasketsData = async () => {
            try {
                setLoading(true);
                setError('');

                const [productsData, typesData] = await Promise.all([
                    fetchProducts(null, 1, 500),
                    fetchTypes()
                ]);

                setAllProducts(
                    Array.isArray(productsData?.rows)
                        ? productsData.rows
                        : []
                );

                setTypes(
                    Array.isArray(typesData)
                        ? typesData
                        : []
                );
            } catch (e) {
                console.error(
                    'Помилка при завантаженні кошиків або категорій:',
                    e
                );

                setAllProducts([]);
                setTypes([]);
                setError(
                    'Не вдалося завантажити кошики для зберігання. Будь ласка, спробуйте оновити сторінку.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadStorageBasketsData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        selectedCategories,
        selectedColors
    ]);

    const storageBaskets = useMemo(() => {
        return allProducts.filter(product => {
            return (
                product?.kind === 'Кошик' &&
                ['IN_STOCK', 'MADE_TO_ORDER'].includes(product?.availability)
            );
        });
    }, [allProducts]);

    const filteredProducts = storageBaskets.filter(product => {
        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(String(product?.typeId));

        const matchesColor =
            selectedColors.length === 0 ||
            selectedColors.includes(product?.color);

        return (
            matchesCategory &&
            matchesColor
        );
    });

    const totalCount = filteredProducts.length;
    const startIdx = (currentPage - 1) * limit;
    const pageProducts = filteredProducts.slice(
        startIdx,
        startIdx + limit
    );
    const activeFiltersCount =
        selectedCategories.length +
        selectedColors.length;

    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        url: PAGE_URL
    };

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: PAGE_TITLE,
        itemListElement: pageProducts.map((product, index) => ({
            '@type': 'ListItem',
            position: startIdx + index + 1,
            url: `https://charivna-craft.com.ua/product/${product.slug}`,
            name: product.name
        }))
    };

    const breadcrumbsSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Головна',
                item: 'https://charivna-craft.com.ua/'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: PAGE_TITLE,
                item: PAGE_URL
            }
        ]
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <Helmet>
                <title>{PAGE_TITLE} – Charivna Craft</title>
                <meta name="description" content={PAGE_DESCRIPTION}/>
                <meta name="robots" content="index, follow"/>
                <link rel="canonical" href={PAGE_URL}/>
                <meta property="og:title" content={`${PAGE_TITLE} – Charivna Craft`}/>
                <meta property="og:description" content={PAGE_DESCRIPTION}/>
                <meta property="og:url" content={PAGE_URL}/>
                <meta property="og:type" content="website"/>
                <script type="application/ld+json">
                    {JSON.stringify(collectionSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(itemListSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbsSchema)}
                </script>
            </Helmet>

            <div className="component__container">
                <Row>
                    <Col md={3} lg={2}>
                        <SideBar>
                            <div className="sidebar__filters">
                                <div className="sidebar__filter__group">
                                    <div className="sidebar__filter__group__title">
                                        Тип виробу: Кошик
                                    </div>
                                </div>
                            </div>

                            <ProductFilter
                                products={storageBaskets}
                                types={types}
                                showKinds={false}
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                selectedColors={selectedColors}
                                setSelectedColors={setSelectedColors}
                            />
                        </SideBar>
                    </Col>

                    <Col md={9} lg={10}>
                        <nav aria-label="breadcrumb" className="mb-3">
                            <Link to={HOME_ROUTE}>Головна</Link>
                            <span className="mx-2">/</span>
                            <span>{PAGE_TITLE}</span>
                        </nav>

                        <h1 className="mb-4">
                            Кошики для зберігання
                        </h1>

                        <p>
                            Добірка кошиків для зберігання зі шнура ручної роботи:
                            для ванної, кухні, дитячої кімнати, полиць і щоденної
                            організації речей вдома.
                        </p>

                        {loading ? (
                            <div className="d-flex justify-content-center py-5">
                                <Spinner animation="border"/>
                            </div>
                        ) : error ? (
                            <p>{error}</p>
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
                                        <ProductList products={pageProducts}/>

                                        {totalCount > limit && (
                                            <PaginationLocal
                                                totalCount={totalCount}
                                                limit={limit}
                                                currentPage={currentPage}
                                                onPageChange={handlePageChange}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <p>
                                        За обраними фільтрами кошики не знайдено.
                                    </p>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </div>

            <MobileFilterModal
                show={showMobileFilters}
                onHide={() => setShowMobileFilters(false)}
                products={storageBaskets}
                types={types}
                showKinds={false}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedKinds={[]}
                setSelectedKinds={() => {}}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
            />
        </>
    );
};

export default StorageBasketsPage;
