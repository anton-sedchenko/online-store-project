import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {fetchProducts} from '../http/productAPI.js';
import {fetchOneType} from '../http/typeAPI.js';
import ProductList from '../components/ProductList.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import {Helmet} from 'react-helmet-async';

const CategoryPage = () => {
    const {id} = useParams();
    const [products, setProducts] = useState([]);
    const [type, setType] = useState(null);

    useEffect(() => {
        fetchOneType(id).then(setType);
        fetchProducts(id, 1, 100).then(data => setProducts(data.rows));
    }, [id]);

    if (!type) return null;

    return (
        <div className="component__container">
            <Helmet>
                <title>{type.name} – Charivna Craft</title>
                <meta name="description" content={`Всі товари категорії ${type.name}`} />
            </Helmet>

            <Breadcrumbs typeId={type.parentId ? type.parentId : type.id} />
            <h2 className="mb-4">{type.name}</h2>
            <ProductList products={products} />

            {/* Можливо буде пагінація категорій */}

        </div>
    );
};

export default CategoryPage;