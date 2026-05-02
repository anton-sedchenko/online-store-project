import React, {useContext, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import CreateProduct from "../components/modals/CreateProduct.jsx";
import CreateType from "../components/modals/CreateType.jsx";
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import Table from "react-bootstrap/Table";
import EditProduct from "../components/modals/EditProduct.jsx";
import AdminPages from "../components/AdminPages.jsx";
import {deleteProduct, fetchOneProduct} from "../http/productAPI.js";
import {Helmet} from "react-helmet-async";
import EditArticle from '../components/modals/EditArticle.jsx';
import CreateArticle from '../components/modals/CreateArticle.jsx';
import {deleteArticle, fetchArticles} from '../http/articleAPI.js';

const Admin = observer(() => {
    const {adminStore} = useContext(Context);

    const [editing, setEditing] = useState(null);
    const [productVisible, setProductVisible] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [editArticleVisible, setEditArticleVisible] = useState(false);
    const [articleVisible, setArticleVisible] = useState(false);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        adminStore.loadProducts();
        fetchArticles(1, 100).then(data => setArticles(data.rows));
    }, [adminStore]);

    const openEditModal = async (productId) => {
        try {
            const fullProduct = await fetchOneProduct(productId);
            setEditing(fullProduct);
        } catch (e) {
            alert("Не вдалося завантажити товар для редагування");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей товар?")) {
            try {
                await deleteProduct(id);
                await adminStore.loadProducts();
            } catch (e) {
                alert("Помилка при видаленні товару");
            }
        }
    };

    const openEditArticleModal = (article) => {
        setEditingArticle(article);
        setEditArticleVisible(true);
    };

    const handleDeleteArticle = async (id) => {
        if (!window.confirm('Видалити статтю?')) return;

        await deleteArticle(id);
        setArticles(articles.filter(a => a.id !== id));
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="component__container">
                <h1>Панель адміністратора</h1>

                <div className="admin__page__action__btn__container">
                    <Button
                        variant={"outline-dark"}
                        className="admin__page__action__btn"
                        onClick={() => setProductVisible(true)}
                    >
                        Додати товар
                    </Button>

                    <Button
                        variant={"outline-dark"}
                        className="admin__page__action__btn"
                        onClick={() => setTypeVisible(true)}
                    >
                        Додати категорію
                    </Button>

                    <Button
                        variant={"outline-dark"}
                        className="admin__page__action__btn"
                        onClick={() => setArticleVisible(true)}
                    >
                        Додати статтю
                    </Button>

                    <CreateProduct
                        show={productVisible}
                        onHide={() => {
                            setProductVisible(false);
                            adminStore.loadProducts();
                        }}
                    />

                    <CreateType
                        show={typeVisible}
                        onHide={() => setTypeVisible(false)}
                    />

                    <CreateArticle
                        show={articleVisible}
                        onHide={() => setArticleVisible(false)}
                        onCreated={art => setArticles([art, ...articles])}
                    />
                </div>

                <h2>Наші статті</h2>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <td>Заголовок</td>
                        <td>Дата</td>
                        <td>Дія</td>
                    </tr>
                    </thead>
                    <tbody>
                    {articles.map(a => (
                        <tr key={a.id}>
                            <td>{a.title}</td>
                            <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => openEditArticleModal(a)}
                                >
                                    Редагувати
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleDeleteArticle(a.id)}
                                >
                                    Видалити
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <h2>Товари магазину</h2>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <td>Назва товару</td>
                        <td>Ціна</td>
                        <td>Код товару</td>
                        <td>Дія</td>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(adminStore.products) && adminStore.products.length > 0 ? (
                        adminStore.products.map(prod => (
                            <tr key={prod.id}>
                                <td>{prod.name}</td>
                                <td>{prod.price}</td>
                                <td>{prod.code}</td>
                                <td className="admin__page__edit__btns__container">
                                    <Button
                                        className="admin__page__edit__btn"
                                        size="sm"
                                        onClick={() => openEditModal(prod.id)}
                                    >
                                        Редагувати
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => handleDeleteProduct(prod.id)}
                                    >
                                        Видалити
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '2rem 0' }}>
                                {adminStore.products === undefined
                                    ? 'Завантаження...'
                                    : 'Товари відсутні'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>

                <AdminPages
                    totalCount={adminStore.productsTotal}
                    limit={adminStore.productsLimit}
                    currentPage={adminStore.productsPage}
                    onPageChange={p => adminStore.setProductsPage(p)}
                />

                {editing && (
                    <EditProduct
                        show={!!editing}
                        onHide={() => {
                            setEditing(null);
                            adminStore.loadProducts();
                        }}
                        productToEdit={editing}
                    />
                )}

                <EditArticle
                    show={editArticleVisible}
                    onHide={() => {
                        setEditArticleVisible(false);
                        setEditingArticle(null);
                    }}
                    articleToEdit={editingArticle}
                    onUpdated={updated => {
                        setArticles(articles.map(a => a.id === updated.id ? updated : a));
                    }}
                />
            </div>
        </>
    );
});

export default Admin;