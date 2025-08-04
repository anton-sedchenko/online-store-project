import {$authHost, $host} from "./index.js";

export const fetchArticles = async (page = 1, limit = 8) => {
    const {data} = await $host.get('/api/article', {params: {page, limit}});
    return data; // { rows: [...], count }
};

export const fetchArticleBySlug = async (slug) => {
    const {data} = await $host.get(`/api/article/${slug}`);
    return data;
};

export const createArticle = async (formData) => {
    const { data } = await $authHost.post(
        '/api/article',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
    );
    return data;
};

export const updateArticle = async (id, formData) => {
    const { data } = await $authHost.put(
        `/api/article/${id}`,
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
    );
    return data;
};

export const deleteArticle = async (id) => {
    const { data } = await $authHost.delete(`/api/article/${id}`);
    return data;
};