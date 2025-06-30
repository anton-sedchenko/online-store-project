import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {Pagination} from "react-bootstrap";

const PaginationComponent = observer(() => {
    const {productStore} = useContext(Context);
    // Загальна кількість сторінок
    const pagesCount = Math.ceil(
        productStore.totalCount / productStore.productsLimitOnOnePage
    );
    const pages = [];

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    return (
        <Pagination>
            {pages.map(page => (
                <Pagination.Item
                    key={page}
                    active={productStore.currentPage === page}
                    onClick={() => {
                        productStore.setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    {page}
                </Pagination.Item>
            ))}
        </Pagination>
    );
});

export default PaginationComponent;