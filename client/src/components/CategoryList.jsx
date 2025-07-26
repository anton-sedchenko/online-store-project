import React, {useEffect, useState} from 'react';
import {Card, Row, Col} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {fetchTypes} from '../http/typeAPI.js';

const CategoryList = () => {
    const [types, setTypes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTypes().then(setTypes);
    }, []);

    return (
        <Row className="g-4">
            {types.map(type => (
                <Col key={type.id} xs={6} sm={4} md={3} lg={2}>
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