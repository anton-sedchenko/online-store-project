import React, {useContext, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import CreateType from "../components/modals/CreateType.jsx";
import CreateProduct from "../components/modals/CreateProduct.jsx";
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import Table from "react-bootstrap/Table";
import EditProduct from "../components/modals/EditProduct.jsx";
import AdminPages from "../components/AdminPages.jsx";
import {deleteProduct, fetchOneProduct} from "../http/productAPI.js";
import {Helmet} from "react-helmet-async";

// виводимо список фігур, кнопка Edit задає фігуру для редагування,
// коли її об’єкт непорожній — вмикаємо модалку редагування з поточним товаром
const Admin = observer(() => {
    const {adminStore} = useContext(Context);
    // поточний об’єкт фігури, яку редагуємо, null якщо жодної
    const [editing, setEditing] = useState(null);
    const [typeVisible, setTypeVisible] = useState(false);
    const [productVisible, setProductVisible] = useState(false);

    useEffect(() => {
        adminStore.loadProducts();
    }, []);

    const openEditModal = async (productId) => {
        try {
            const fullProduct = await fetchOneProduct(productId);
            setEditing(fullProduct);
        } catch (e) {
            alert("Не вдалося завантажити товар для редагування");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей товар?")) {
            try {
                await deleteProduct(id);
                await adminStore.loadProducts(); // оновлюємо список після видалення
            } catch (e) {
                alert("Помилка при видаленні товару");
            }
        }
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="component__container">
                <div className="admin__page__action__btn__container">
                    <Button
                        variant={"outline-dark"}
                        className="admin__page__action__btn"
                        onClick={() => setTypeVisible(true)}
                    >
                        Додати тип
                    </Button>
                    <Button
                        variant={"outline-dark"}
                        className="admin__page__action__btn"
                        onClick={() => setProductVisible(true)}
                    >
                        Додати товар
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
                </div>
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
                    {adminStore.products.map(prod => (
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
                                    onClick={() => handleDelete(prod.id)}
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

                {/* Модалка редагування товару */}

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
            </div>
        </>
    );
});

export default Admin;
