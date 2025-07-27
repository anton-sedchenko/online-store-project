import React, {useEffect, useState} from 'react';
import {Card, Row, Col} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {fetchTypes} from '../http/typeAPI.js';
import ProductItem from "./ProductItem.jsx";

const CategoryList = () => {
    const [types, setTypes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTypes().then(setTypes);
    }, []);

    return (
        <Row className="gallery">
            {types.map(type => (
                <Col
                    xs={12}    /* до 576px — 1 колонка */
                    sm={6}     /* 576–767 — 2 колонки */
                    md={6}     /* 768–991 — 2 колонки */
                    lg={4}     /* 992–1199 — 3 колонки (12/4=3) */
                    xl={3}     /* від 1200px — 4 колонки (12/3=4) */
                    key={type.id}
                    className="gallery__row"
                >
                    <Card
                        className="category-card text-center cursor-pointer h-100"
                        onClick={() => navigate(`/category/${type.id}`)}
                    >
                        {type.image ? (
                            <Card.Img
                                variant="top"
                                src={type.image}
                                style={{objectFit: 'cover', height: 120}}
                            />
                        ) : (
                            <div style={{height:120, background:'#f0f0f0'}} />
                        )}
                        <Card.Body>
                            <Card.Title>{type.name}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default CategoryList;