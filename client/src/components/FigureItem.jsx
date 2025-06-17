import React from 'react';
import {Card, Col, Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {FIGURE_ROUTE} from "../utils/consts.js";

const FigureItem = ({figure}) => {
    const navigate = useNavigate();

    return (
        <Col md={3} onClick={() => navigate(`${FIGURE_ROUTE}/${figure.id}`)}>
            <Card
                style={{width: 150, cursor: "pointer", marginBottom: "20px"}}
                border={"light"}
            >
                <Image
                    width={150}
                    height={150}
                    src={`${import.meta.env.VITE_APP_API_URL}${figure.img}`}
                />
                <div><p>Артикул: {figure.code}</p></div>
                <div><h6>{figure.name}</h6></div>
                <div>Ціна: {figure.price} грн.</div>
            </Card>
        </Col>
    );
};

export default FigureItem;