import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {Row, Col, Card} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import PaginationLocal from "../components/PaginationLocal.jsx";
import SideBar from "../components/SideBar.jsx";

const BlogList = observer(() => {
    const {articleStore} = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        articleStore.loadArticles(1);
        }, [articleStore]);

    return (
        <>
            <div className="component__container">
                <Row>
                    <Col
                        md={3}
                        lg={2}
                        className="sidebar__col__container"
                    >
                        <SideBar/>
                    </Col>
                    <Col
                        md={9}
                        lg={10}
                    >
                        <h2 className="mb-4">Блог</h2>
                        <Row className="gallery">
                            {articleStore.articles.map(a => (
                                <Col
                                    xs={12}    /* до 576px — 1 колонка */
                                    sm={6}     /* 576–767 — 2 колонки */
                                    md={6}     /* 768–991 — 2 колонки */
                                    lg={4}     /* 992–1199 — 3 колонки (12/4=3) */
                                    xl={3}     /* від 1200px — 4 колонки (12/3=4) */
                                    key={a.id}
                                    className="gallery__row"
                                >
                                    <Card
                                        onClick={() => navigate(`/blog/${a.slug}`)}
                                        className="neu-card gallery__card"
                                    >
                                        {a.image && <Card.Img variant="top" src={a.image} />}
                                        <Card.Body>
                                            <Card.Title>{a.title}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <PaginationLocal
                        totalCount={articleStore.total}
                        limit={articleStore.limit}
                        currentPage={articleStore.page}
                        onPageChange={p => articleStore.loadArticles(p)}
                    />
                </Row>
            </div>
        </>
    );
});

export default BlogList;