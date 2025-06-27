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
        <Row className="typebar__container">
            {productStore.types.map(type =>
                <div
                    key={type.id}
                    onClick={() => {
                        productStore.setSelectedType(type);
                        productStore.setCurrentPage(1);
                    }}
                    className={type.id === productStore.selectedType.id
                        ? "typebar__item neu-card typebar__item-active"
                        : "typebar__item neu-card"
                    }
                >
                    <p>{type.name}</p>
                    {userStore.isAuth && userStore.user.role === "ADMIN" &&
                        <Button
                            onClick={(e) => {
                                onDelete(type.id);
                                e.stopPropagation();
                            }}
                        >
                            X
                        </Button>
                    }
                </div>
            )}
            <Card
                key="reset"
                className="typebar__item neu-card typebar__item-cancel"
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
