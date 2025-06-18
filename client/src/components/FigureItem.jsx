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
                <p className="gallery__card__product__code">Артикул: {figure.code}</p>
                <h6 className="gallery__card__product__name">{figure.name}</h6>
                <p className="gallery__card__product__price">Ціна: <span>{figure.price}</span> грн.</p>
            </Card>
        </Col>
    );
};

export default FigureItem;