import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Image, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {fetchOneFigure} from "../http/figureAPI.js";

const FigurePage = () => {
    const [figure, setFigure] = useState({info: []});
    // Отримуєм параметри айді із строки запиту
    const {id} = useParams();
    // При завантаженні сторінки товару один раз підгружаємо цей товар
    useEffect(() => {
        fetchOneFigure(id).then(data => setFigure(data));
    }, []);

    return (
        <Container>
            <Row>
                <Col md={4}>
                    <Image width={300} height={300} src={`${import.meta.env.VITE_APP_API_URL}${figure.img}`} />
                </Col>
                <Col md={4}>
                    <Row>
                        <h2>{figure.name}</h2>
                        <h3>Опис:</h3>
                        <p>
                            {figure.info.map((info) =>
                                <Row key={info.id}>
                                    {info.title}: {info.description}
                                </Row>
                            )}
                        </p>
                    </Row>
                </Col>
                <Col md={4}>
                    <Card
                        className="d-flex flex-column align-items-center justify-content-around"
                        style={{width: 300, height: 300, fontSize: 32, border: "5px solid lightgray"}}>
                        <h3>{figure.price} грн.</h3>
                        <Button variant={"outline-dark"}>Додати в кошик</Button>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FigurePage;
