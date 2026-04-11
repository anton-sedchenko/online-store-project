import React from 'react';
import { Form } from 'react-bootstrap';

const ProductFilter = ({
    products,
    selectedKinds,
    setSelectedKinds,
    selectedColors,
    setSelectedColors,
}) => {
    const safeProducts = Array.isArray(products) ? products : [];

    const kinds = [...new Set(safeProducts.map(p => p?.kind).filter(Boolean))];
    const colors = [...new Set(safeProducts.map(p => p?.color).filter(Boolean))];

    const toggleKind = (k) => {
        if (selectedKinds.includes(k)) {
            setSelectedKinds(selectedKinds.filter(x => x !== k));
        } else {
            setSelectedKinds([...selectedKinds, k]);
        }
    };

    const toggleColor = (c) => {
        if (selectedColors.includes(c)) {
            setSelectedColors(selectedColors.filter(x => x !== c));
        } else {
            setSelectedColors([...selectedColors, c]);
        }
    };

    if (!kinds.length && !colors.length) {
        return null;
    }

    return (
        <div className="mt-4">
            <h5 className="mb-3">Фільтри</h5>

            {kinds.length > 0 && (
                <div className="mb-3">
                    <div className="fw-semibold mb-1">Тип виробу</div>
                    <div className="sidebar__filter__option__container">
                        {kinds.map(k => (
                            <Form.Check
                                key={k}
                                type="checkbox"
                                label={k}
                                checked={selectedKinds.includes(k)}
                                onChange={() => toggleKind(k)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {colors.length > 0 && (
                <div className="mb-3">
                    <div className="fw-semibold mb-1">Колір</div>
                    <div className="sidebar__filter__option__container">
                        {colors.map(c => (
                            <Form.Check
                                key={c}
                                type="checkbox"
                                label={c}
                                checked={selectedColors.includes(c)}
                                onChange={() => toggleColor(c)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFilter;