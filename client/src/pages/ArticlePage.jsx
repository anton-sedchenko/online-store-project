import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {fetchArticleBySlug} from '../http/articleAPI.js';
import {Helmet} from "react-helmet-async";

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
                <h1>{article.title}</h1>
                {article.image && <img src={article.image} alt="" className="img-fluid mb-4" />}
                <div dangerouslySetInnerHTML={{__html: article.content}} />
            </div>
        </>
    );
};

export default ArticlePage;