import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

/**
 * Проста пагінація для адмінки
 *
 * @param {number} totalCount — загальна кількість товарів
 * @param {number} limit — скільки товарів буде на сторінці
 * @param {number} currentPage — поточна сторінка
 * @param {(page: number) => void} onPageChange — колбек при кліку
 */

const AdminPages = ({totalCount, limit, currentPage, onPageChange}) => {
    const pagesCount = Math.ceil(totalCount / limit);
    if (pagesCount <= 1) return null;

    const pages = Array.from({length: pagesCount}, (_, i) => i + 1);

    return (
        <Pagination className="mt-3">
            {pages.map(page => (
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Pagination.Item>
            ))}
        </Pagination>
    );
};

export default AdminPages;