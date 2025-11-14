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
            'Набори акрилових фарб для творчості та розмальовки гіпсових фігурок. Насичені кольори, які швидко сохнуть.',
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

    const seo = CATEGORY_SEO[type.name] || {
        description: `Товари категорії ${type.name} ручної роботи від Charivna Craft.`,
        ogDescription: `Всі товари категорії ${type.name} у магазині Charivna Craft.`,
    };

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

                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: `${type.name} – Charivna Craft`,
                        description: seo.description,
                        url: `https://charivna-craft.com.ua/category/${id}`,
                    })}
                </script>
            </Helmet>

            <div className="component__container">
                <Row>
                    <Col md={3} lg={2}>
                        <SideBar/>
                    </Col>
                    <Col md={9} lg={10}>
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
        </>
    );
};

export default CategoryPage;