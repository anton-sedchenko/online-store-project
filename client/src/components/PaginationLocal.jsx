import React from 'react'
import {Pagination} from 'react-bootstrap'

const PaginationLocal = ({totalCount, limit, currentPage, onPageChange}) => {
    const pagesCount = Math.ceil(totalCount / limit)
    const pages = Array.from({length: pagesCount}, (_, i) => i + 1)

    if (pagesCount <= 1) return null

    return (
        <Pagination className="mt-4 justify-content-center">
            {pages.map(page => (
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => {
                        onPageChange(page)
                    }}
                >
                    {page}
                </Pagination.Item>
            ))}
        </Pagination>
    )
}

export default PaginationLocal