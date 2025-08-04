import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {Row, Col, Card} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {BLOG_ROUTE, ARTICLE_ROUTE} from "../utils/consts.js";
import PaginationLocal from "../components/PaginationLocal.jsx";

const BlogList = observer(() => {
    const {articleStore} = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        articleStore.loadArticles(1);
        }, [articleStore]);

    return (
        <>
            <Row className="gallery">
                {articleStore.articles.map(a => (
                    <Col key={a.id} xs={12} sm={6} md={4} lg={3}>
                        <Card
                            onClick={() => navigate(`/blog/${a.slug}`)}
                            className="neu-card"
                        >
                            {a.image && <Card.Img variant="top" src={a.image} />}
                            <Card.Body>
                                <Card.Title>{a.title}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <PaginationLocal
                totalCount={articleStore.total}
                limit={articleStore.limit}
                currentPage={articleStore.page}
                onPageChange={p => articleStore.loadArticles(p)}
            />
        </>
    );
});

export default BlogList;