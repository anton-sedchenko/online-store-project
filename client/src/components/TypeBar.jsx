import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Card, Row} from "react-bootstrap";
import {Context} from "../main.jsx";
import { FaBan } from "react-icons/fa";

const TypeBar = observer(() => {
    const {figure} = useContext(Context);

    return (
        <Row className="d-flex flex-wrap mb-3">
            {figure.types.map(type =>
                <Card
                    key={type.id}
                    className="figure__typeBar__item p-2 m-2"
                    style={{width: "150px", textAlign: "center", cursor: "pointer", borderWidth: "2px"}}
                    onClick={() => {
                        figure.setSelectedType(type);
                        figure.setCurrentPage(1);
                    }}
                    border={type.id === figure.selectedType.id ? "success" : "secondary"}
                >
                    {type.name}
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
