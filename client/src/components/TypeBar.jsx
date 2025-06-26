import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Card, Row} from "react-bootstrap";
import {Context} from "../main.jsx";
import {FaBan} from "react-icons/fa";
import {deleteType} from "../http/typeAPI.js";

const TypeBar = observer(() => {
    const {userStore, productStore} = useContext(Context);

    const onDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей тип?')) {
            await deleteType(id);
            await productStore.fetchTypes(); // оновлюємо список
        }
    };

    return (
        <Row className="d-flex flex-wrap mb-3">
            {productStore.types.map(type =>
                <Card
                    key={type.id}
                    className="product__typeBar__item p-2 m-2"
                    onClick={() => {
                        productStore.setSelectedType(type);
                        productStore.setCurrentPage(1);
                    }}
                    border={type.id === productStore.selectedType.id ? "success" : "secondary"}
                >
                    <div>
                        <p>{type.name}</p>
                    </div>
                    {userStore.isAuth && userStore.user.role === "ADMIN" &&
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={(e) => {
                                onDelete(type.id);
                                e.stopPropagation();
                            }}
                        >
                            X
                        </Button>
                    }
                </Card>
            )}
            <Card
                key="reset"
                className="m-2 p-2 product__typeBar__item border-danger
                            text-danger d-flex flex-row align-items-center flex-shrink-0"
                style={{ width: 160, cursor: 'pointer' }}
                onClick={() => {
                    productStore.setSelectedType({});
                    productStore.setCurrentPage(1);
                }}
            >
                <FaBan size={18} className="me-2" />
                <span>Скинути фільтр</span>
            </Card>
        </Row>
    );
});

export default TypeBar;
