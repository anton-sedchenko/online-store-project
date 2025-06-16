import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {Pagination} from "react-bootstrap";

const Pages = observer(() => {
    const {figure} = useContext(Context);
    // Загальна кількість сторінок
    const pagesCount = Math.ceil(
        figure.totalCount / figure.figuresLimitOnOnePage
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
                    active={figure.currentPage === page}
                    onClick={() => figure.setCurrentPage(page)}
                >
                    {page}
                </Pagination.Item>
            ))}
        </Pagination>
    );
});

export default Pages;