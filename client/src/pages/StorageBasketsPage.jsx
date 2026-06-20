import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Breadcrumb, Spinner} from 'react-bootstrap';
import {Helmet} from 'react-helmet-async';
import {Link} from 'react-router-dom';

import ProductList from '../components/ProductList.jsx';
import {fetchProducts} from '../http/productAPI.js';
import {HOME_ROUTE, STORAGE_BASKETS_ROUTE} from '../utils/consts.js';

const PAGE_URL = 'https://charivna-craft.com.ua/koshyky-dlia-zberihannia';
const PAGE_TITLE = 'Кошики для зберігання зі шнура';
const META_TITLE = 'Кошики для зберігання зі шнура | Charivna Craft';
const META_DESCRIPTION = 'Кошики для зберігання зі шнура ручної роботи для дому, ванної, кухні та дитячої кімнати. Різні форми, розміри й кольори з доставкою по Україні.';
const OG_IMAGE = 'https://charivna-craft.com.ua/header-basket.webp';
const ALLOWED_AVAILABILITY = ['IN_STOCK', 'MADE_TO_ORDER'];

const StorageBasketsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(false);

                const productsData = await fetchProducts(null, 1, 500);

                setProducts(
                    Array.isArray(productsData?.rows)
                        ? productsData.rows
                        : []
                );
            } catch (e) {
                console.error('Помилка при завантаженні кошиків для зберігання:', e);
                setProducts([]);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const storageBaskets = useMemo(() => products.filter(product => (
        product?.kind === 'Кошик' &&
        ALLOWED_AVAILABILITY.includes(product?.availability)
    )), [products]);

    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: PAGE_TITLE,
        description: META_DESCRIPTION,
        url: PAGE_URL,
        inLanguage: 'uk-UA',
        isPartOf: {
            '@type': 'WebSite',
            name: 'Charivna Craft',
            url: 'https://charivna-craft.com.ua/'
        }
    };

    const itemListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: storageBaskets.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: product.name,
            url: `https://charivna-craft.com.ua/product/${product.slug}`
        }))
    };

    const breadcrumbJsonLd = {
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
                name: 'Кошики для зберігання',
                item: PAGE_URL
            }
        ]
    };

    return (
        <>
            <Helmet>
                <title>{META_TITLE}</title>

                <meta name="description" content={META_DESCRIPTION}/>
                <meta name="robots" content="index, follow"/>
                <link rel="canonical" href={PAGE_URL}/>

                <meta property="og:type" content="website"/>
                <meta property="og:title" content={META_TITLE}/>
                <meta property="og:description" content={META_DESCRIPTION}/>
                <meta property="og:url" content={PAGE_URL}/>
                <meta property="og:image" content={OG_IMAGE}/>

                <script type="application/ld+json">
                    {JSON.stringify(collectionJsonLd)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(itemListJsonLd)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbJsonLd)}
                </script>
            </Helmet>

            <div className="component__container">
                <Breadcrumb>
                    <Breadcrumb.Item linkAs={Link} linkProps={{to: HOME_ROUTE}}>
                        Головна
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        Кошики для зберігання
                    </Breadcrumb.Item>
                </Breadcrumb>

                <h1 className="mb-3">{PAGE_TITLE}</h1>

                <p className="mb-4">
                    На цій сторінці зібрані кошики зі шнура для організації та
                    зберігання речей у різних кімнатах: у ванній, на кухні, у
                    дитячій або в житловому просторі. Обирайте форму, розмір і
                    колір, які найкраще пасують до вашого дому.
                </p>

                {loading && (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border"/>
                    </div>
                )}

                {!loading && error && (
                    <Alert variant="danger">
                        Не вдалося завантажити кошики для зберігання. Будь ласка,
                        оновіть сторінку або спробуйте пізніше.
                    </Alert>
                )}

                {!loading && !error && storageBaskets.length > 0 && (
                    <ProductList products={storageBaskets}/>
                )}

                {!loading && !error && storageBaskets.length === 0 && (
                    <Alert variant="light">
                        Зараз немає доступних кошиків для зберігання. Перегляньте
                        каталог пізніше або зв’яжіться з нами для уточнення наявності.
                    </Alert>
                )}
            </div>
        </>
    );
};

export default StorageBasketsPage;
