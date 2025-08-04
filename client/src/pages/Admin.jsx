import React, {useContext, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import CreateCategory from "../components/modals/CreateCategory.jsx";
import EditCategory from "../components/modals/EditCategory.jsx";
import CreateProduct from "../components/modals/CreateProduct.jsx";
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import Table from "react-bootstrap/Table";
import EditProduct from "../components/modals/EditProduct.jsx";
import AdminPages from "../components/AdminPages.jsx";
import {deleteProduct, fetchOneProduct} from "../http/productAPI.js";
import {deleteType} from '../http/typeAPI.js';
import {Helmet} from "react-helmet-async";
import EditArticle from '../components/modals/EditArticle.jsx';
import CreateArticle   from '../components/modals/CreateArticle.jsx';
import {deleteArticle, fetchArticles}  from '../http/articleAPI.js';

// виводимо список фігур, кнопка Edit задає фігуру для редагування,
// коли її об’єкт непорожній — вмикаємо модалку редагування з поточним товаром
const Admin = observer(() => {
    const {adminStore, productStore} = useContext(Context);
    // поточний об’єкт фігури, яку редагуємо, null якщо жодної
    const [editing, setEditing] = useState(null);
    const [productVisible, setProductVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editingArticle, setEditingArticle] = useState(null);
    const [editArticleVisible, setEditArticleVisible] = useState(false);
    const [articleVisible, setArticleVisible] = useState(false);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        productStore.fetchTypes();
        adminStore.loadProducts();
        fetchArticles(1, 100).then(data => setArticles(data.rows));
    }, [productStore, adminStore]);

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
                await adminStore.loadProducts(); // оновлюємо список після видалення
            } catch (e) {
                alert("Помилка при видаленні товару");
            }
        }
    };

    const handleDeleteType = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цю категорію?')) return;
        try {
            await deleteType(id);
            await productStore.fetchTypes();  // перезавантажуємо список
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const openEditArticleModal = (article) => {
        setEditingArticle(article);
        setEditArticleVisible(true);
    };

    const handleDeleteArticle = async id => {
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
                        onClick={() => setCategoryModalVisible(true)}
                    >
                        Додати категорію
                    </Button>
                    <Button
                        variant={"outline-dark"}
                        className="admin__page__action__btn"
                        onClick={() => setProductVisible(true)}
                    >
                        Додати товар
                    </Button>
                    <Button
                        variant={"outline-dark"}
                        onClick={() => setArticleVisible(true)}
                    >
                        Додати статтю
                    </Button>
                    <CreateCategory
                        show={categoryModalVisible}
                        onHide={() => setCategoryModalVisible(false)}
                    />
                    <CreateProduct
                        show={productVisible}
                        onHide={() => {
                            setProductVisible(false);
                            adminStore.loadProducts();
                        }}
                    />
                    <CreateArticle
                        show={articleVisible}
                        onHide={() => setArticleVisible(false)}
                        onCreated={art => setArticles([art, ...articles])}
                    />
                </div>
                <h2>Категорії магазину</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <td>Назва категорії</td>
                            <td>Картинка</td>
                            <td>Дія</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(productStore.types) && productStore.types.map(cat => (
                            <tr key={cat.id}>
                                <td>{cat.name}</td>
                                <td>
                                    {cat.image && <img alt="" src={cat.image} width="50" />}
                                </td>
                                <td className="admin__page__edit__btns__container">
                                    <Button
                                        size="sm"
                                        className="admin__page__edit__btn"
                                        onClick={() => setEditCategoryId(cat.id)}>
                                        Редагувати
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => handleDeleteType(cat.id)}>
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

                <h2>Наші статті</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr><td>Заголовок</td><td>Дата</td><td>Дія</td></tr>
                    </thead>
                    <tbody>
                        {articles.map(a=>(
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
                                        onClick={()=>handleDeleteArticle(a.id)}
                                    >
                                Видалити
                                </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Пагінація */}

                <AdminPages
                    totalCount={adminStore.productsTotal}
                    limit={adminStore.productsLimit}
                    currentPage={adminStore.productsPage}
                    onPageChange={p => adminStore.setProductsPage(p)}
                />

                {/* Модалки редагування категорій та товару */}

                {editCategoryId && (
                    <EditCategory
                        show={!!editCategoryId}
                        typeId={editCategoryId}
                        onHide={() => setEditCategoryId(null)}
                    />
                )}
                {editing &&
                    <EditProduct
                        show={!!editing}
                        onHide={() => {
                            setEditing(null);
                            adminStore.loadProducts();
                        }}
                        productToEdit={editing}
                    />
                }
                <EditArticle
                    show={editArticleVisible}
                    onHide={() => {
                        setEditArticleVisible(false);
                        setEditingArticle(null);
                    }}
                    articleToEdit={editingArticle}
                    onUpdated={updated => {
                        // оновлюємо список на місці
                        setArticles(articles.map(a => a.id === updated.id ? updated : a));
                    }}
                />
            </div>
        </>
    );
});

export default Admin;
