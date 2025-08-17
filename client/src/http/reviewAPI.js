import { $authHost, $host } from './index.js';

export async function getReviews(productId) {
    const { data } = await $host.get(`/review/${productId}`);
    return data; // { items: [...], rating: {avg, count} }
}

export async function addReview({ productId, rating, text }) {
    const { data } = await $authHost.post('/review', { productId, rating, text });
    return data;
}

export async function replyReview(parentId, text) {
    const { data } = await $authHost.post(`/review/${parentId}/reply`, { text });
    return data;
}

export async function deleteReview(id) {
    const { data } = await $authHost.delete(`/review/${id}`);
    return data;
}