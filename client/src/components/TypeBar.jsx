import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Card, Row} from "react-bootstrap";
import {Context} from "../main.jsx";
import {FaBan} from "react-icons/fa";
import {deleteType} from "../http/typeAPI.js";

const TypeBar = observer(() => {
    const {user, figure} = useContext(Context);

    const onDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей тип?')) {
            await deleteType(id);
            await figure.fetchTypes(); // оновлюємо список
        }
    };

    return (
        <Row className="d-flex flex-wrap mb-3">
            {figure.types.map(type =>
                <Card
                    key={type.id}
                    className="figure__typeBar__item p-2 m-2"
                    onClick={() => {
                        figure.setSelectedType(type);
                        figure.setCurrentPage(1);
                    }}
                    border={type.id === figure.selectedType.id ? "success" : "secondary"}
                >
                    <div>
                        <p>{type.name}</p>
                    </div>
                    {user.isAuth && user.user.role === "ADMIN" &&
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
                className="m-2 p-2 figure__typeBar__item border-danger
                            text-danger d-flex flex-row align-items-center flex-shrink-0"
                style={{ width: 160, cursor: 'pointer' }}
                onClick={() => {
                    figure.setSelectedType({});
                    figure.setCurrentPage(1);
                }}
            >
                <FaBan size={18} className="me-2" />
                <span>Скинути фільтр</span>
            </Card>
        </Row>
    );
});

export default TypeBar;
