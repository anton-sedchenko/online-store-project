import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

import SideBar from '../components/SideBar.jsx';
import { fetchProducts } from '../http/productAPI.js';
import { fetchOneType } from '../http/typeAPI.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import PaginationLocal from '../components/PaginationLocal.jsx';
import ProductList from '../components/ProductList.jsx';
import ProductFilter from '../components/ProductFilter.jsx';

const CATEGORY_SEO = {
    'Гіпсові фігурки': {
        description:
            'Гіпсові фігурки для розмальовки — творчість для дітей і дорослих. Безпечні, деталізовані, ідеальні для подарунків та декору.',
        ogDescription:
            'Гіпсові фігурки ручної роботи для розмальовування та декору. Якісний гіпс, чіткі деталі, великий вибір моделей.',
    },
    'Фарби': {
        description:
            'Акрилові фарби для розмальовки гіпсових фігурок. Яскраві, стійкі й безпечні — з пензликом у наборі.',
        ogDescription:
            'Набори акрилових фарб для творчості та розмальовки гіпсових фігурок.',
    },
    'Вироби зі шнура': {
        description:
            'Кошики, підставки, серветки та інші вироби з бавовняного шнура ручної роботи. Стильний декор у мінімалістичному стилі.',
        ogDescription:
            'Вироби зі шнура для дому: кошики, серветки, підставки. Ручна робота, натуральні матеріали, можливе виготовлення під замовлення.',
    },
    'Вироби з бісеру': {
        description:
            'Прикраси з бісеру ручної роботи: гердани, браслети та аксесуари. Етнічні й сучасні дизайни.',
        ogDescription:
            'Гердани, браслети та прикраси з бісеру. Ручна робота, стильні аксесуари для подарунків та особливих образів.',
    },
};

const CategoryPage = () => {
    const { id } = useParams();
    const typeId = Number(id);

    const [type, setType] = useState(null);

    const [allProducts, setAllProducts] = useState([]); // всі товари категорії
    const [loading, setLoading] = useState(true);

    // фільтри
    const [selectedKinds, setSelectedKinds] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [onlySets, setOnlySets] = useState(false);

    // локальна пагінація
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 12;

    useEffect(() => {
        // при зміні фільтрів завжди переходимо на першу сторінку пагінації
        setCurrentPage(1);
    }, [selectedKinds, selectedColors]);

    // завантажуємо інформацію про категорію
    useEffect(() => {
        fetchOneType(id).then(setType);
    }, [id]);

    // тягнемо всі товари цієї категорії (до 500)
    useEffect(() => {
        if (!typeId) return;
        setLoading(true);
        fetchProducts(id, 1, 500).then(data => {
            setAllProducts(data.rows || []);
            setLoading(false);
            setCurrentPage(1); // при зміні категорії скидаємо на 1 сторінку
        });
    }, [id, typeId]);

    if (!type) return null;

    const seo = CATEGORY_SEO[type.name] || {
        description: `Товари категорії ${type.name} ручної роботи від Charivna Craft.`,
        ogDescription: `Всі товари категорії ${type.name} у магазині Charivna Craft.`,
    };

    // застосовуємо фільтри до всіх товарів (без useMemo)
    const filteredProducts = allProducts.filter(p => {
        if (selectedKinds.length && !selectedKinds.includes(p?.kind)) return false;
        if (selectedColors.length && !selectedColors.includes(p?.color)) return false;
        if (onlySets && !p?.isSet) return false;
        return true;
    });

    // локальна пагінація по відфільтрованих
    const totalCount = filteredProducts.length;
    const startIdx = (currentPage - 1) * limit;
    const pageProducts = filteredProducts.slice(startIdx, startIdx + limit);

    return (
        <>
            <Helmet>
                <title>{type.name} – Charivna Craft</title>

                <link
                    rel="canonical"
                    href={`https://charivna-craft.com.ua/category/${id}`}
                />

                <meta
                    name="description"
                    content={seo.description}
                />

                <meta
                    property="og:title"
                    content={`${type.name} – Charivna Craft`}
                />
                <meta
                    property="og:description"
                    content={seo.ogDescription}
                />
                <meta
                    property="og:url"
                    content={`https://charivna-craft.com.ua/category/${id}`}
                />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="component__container">
                <Row>
                    <Col md={3} lg={2}>
                        <SideBar />

                        <ProductFilter
                            products={allProducts}
                            categoryName={type.name}
                            selectedKinds={selectedKinds}
                            setSelectedKinds={setSelectedKinds}
                            selectedColors={selectedColors}
                            setSelectedColors={setSelectedColors}
                            onlySets={onlySets}
                            setOnlySets={setOnlySets}
                        />
                    </Col>

                    <Col md={9} lg={10}>
                        <Breadcrumbs typeId={type.parentId ? type.parentId : type.id} />
                        <h2 className="mb-4">{type.name}</h2>

                        {loading ? (
                            <div className="d-flex justify-content-center py-5">
                                <Spinner animation="border" />
                            </div>
                        ) : (
                            <ProductList products={pageProducts} />
                        )}
                    </Col>
                </Row>

                <PaginationLocal
                    totalCount={totalCount}
                    limit={limit}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </>
    );
};

export default CategoryPage;