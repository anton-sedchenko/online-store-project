import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {fetchArticleBySlug} from '../http/articleAPI.js';
import {Helmet} from "react-helmet-async";
import {Col, Row} from "react-bootstrap";
import SideBar from "../components/SideBar.jsx";

const ArticlePage = () => {
    const {slug} = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        fetchArticleBySlug(slug).then(setArticle);
    }, [slug]);

    if (!article) return null;

    return (
        <>
            <Helmet>
                <title>{article.title} – Charivna Craft</title>
                <meta name="description" content={article.title} />
            </Helmet>

            <div className="component__container">
                <Row>
                    <Col md={3} lg={2}>
                        <SideBar/>
                    </Col>
                    <Col md={9} lg={10}>
                        <h1>{article.title}</h1>
                        <div className="article__img__container">
                            {article.image && <img src={article.image} alt="" className="img-fluid mb-4" />}
                        </div>
                        <div dangerouslySetInnerHTML={{__html: article.content}} />
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ArticlePage;