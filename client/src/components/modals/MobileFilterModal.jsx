import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ProductFilter from '../ProductFilter';

const MobileFilterModal = ({
    show,
    onHide,
    products,
    selectedKinds,
    setSelectedKinds,
    selectedColors,
    setSelectedColors,
}) => {
    const hasActiveFilters = selectedKinds.length > 0 || selectedColors.length > 0;

    const handleResetFilters = () => {
        setSelectedKinds([]);
        setSelectedColors([]);
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="mobile-filter-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Фільтри</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <ProductFilter
                    products={products}
                    selectedKinds={selectedKinds}
                    setSelectedKinds={setSelectedKinds}
                    selectedColors={selectedColors}
                    setSelectedColors={setSelectedColors}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    onClick={handleResetFilters}
                    disabled={!hasActiveFilters}
                >
                    Скинути
                </Button>

                <Button
                    variant="dark"
                    onClick={onHide}
                    className="mobile-filter-modal__apply"
                >
                    Показати товари
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MobileFilterModal;