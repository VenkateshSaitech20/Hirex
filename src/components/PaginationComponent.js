import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import PropTypes from 'prop-types';

const PaginationComponent = ({ currentPage, totalPages, handlePageChange, flag }) => {
    if(!flag){
        flag = "pagination";
    }
    const renderPaginationItems = () => {
        const pageItems = [];
        const maxDisplayedPages = window.innerWidth <= 576 ? 1 : 3;
        if (totalPages <= maxDisplayedPages + 1) {
            for (let i = 1; i <= totalPages; i++) {
                pageItems.push(
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                        {i}
                    </Pagination.Item>
                );
            }
        } else {
            const startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
            const endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
            for (let i = startPage; i <= endPage; i++) {
                pageItems.push(
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                        {i}
                    </Pagination.Item>
                );
            }
            if (startPage > 1) {
                pageItems.unshift(
                    <Pagination.Ellipsis key="ellipsis1" onClick={() => handlePageChange(1)} />
                );
            }
            if (endPage < totalPages) {
                pageItems.push(
                    <Pagination.Ellipsis key="ellipsis2" onClick={() => handlePageChange(totalPages)} />
                );
            }
            if (endPage < totalPages) {
                pageItems.push(
                    <Pagination.Item key="total-pages" onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </Pagination.Item>
                );
            }
        }
        return pageItems;
    };

    return (
        <Pagination className={flag === "pagination" ? 'pagination-wrap' : 'table-pagination-wrap'}>
            <Pagination.First onClick={() => handlePageChange(1)} />
            <Pagination.Prev onClick={() => handlePageChange(Math.max(1, currentPage - 1))} />
            {renderPaginationItems()}
            <Pagination.Next onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} />
        </Pagination>
    );
};

PaginationComponent.propTypes = {
    currentPage : PropTypes.number,
    totalPages : PropTypes.number,
    handlePageChange : PropTypes.func,
    flag : PropTypes.string,
}

export default PaginationComponent;