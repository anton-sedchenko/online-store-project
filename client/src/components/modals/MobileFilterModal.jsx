import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import ProductFilter from '../ProductFilter.jsx';

const MobileFilterModal = ({
    show,
    onHide,
    products,
    types,
    selectedCategories,
    setSelectedCategories,
    selectedKinds,
    setSelectedKinds,
    selectedColors,
    setSelectedColors
}) => {
    const safeSelectedCategories = Array.isArray(selectedCategories)
        ? selectedCategories
        : [];

    const safeSelectedKinds = Array.isArray(selectedKinds)
        ? selectedKinds
        : [];

    const safeSelectedColors = Array.isArray(selectedColors)
        ? selectedColors
        : [];

    const hasActiveFilters =
        safeSelectedCategories.length > 0 ||
        safeSelectedKinds.length > 0 ||
        safeSelectedColors.length > 0;

    const handleResetFilters = () => {
        setSelectedCategories([]);
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
                    types={types}
                    selectedCategories={safeSelectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedKinds={safeSelectedKinds}
                    setSelectedKinds={setSelectedKinds}
                    selectedColors={safeSelectedColors}
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
