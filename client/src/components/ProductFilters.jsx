import React from 'react';
import { Form } from 'react-bootstrap';

// які фільтри вмикаємо для кожної категорії (по імені type.name)
const CATEGORY_FILTERS = {
    'Гіпсові фігурки': { color: false, kind: true, isSet: true },
    'Фарби':           { color: false, kind: false, isSet: false },
    'Вироби зі шнура': { color: true,  kind: true, isSet: true },
    'Вироби з бісеру': { color: false, kind: true, isSet: true },
};

const ProductFilters = ({
                             products,
                             categoryName,
                             selectedKinds,
                             setSelectedKinds,
                             selectedColors,
                             setSelectedColors,
                             onlySets,
                             setOnlySets,
                         }) => {
    const safeProducts = Array.isArray(products) ? products : [];

    const config = CATEGORY_FILTERS[categoryName] || {};
    const showColor = config.color;
    const showKind  = config.kind;
    const showIsSet = config.isSet;

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

    // якщо для цієї категорії нічого не показуємо – не рендеримо блок
    if (!showColor && !showKind) {
        return null;
    }

    return (
        <div className="mt-4">
            <h5 className="mb-3">Фільтри</h5>

            {showKind && kinds.length > 0 && (
                <div className="mb-3">
                    <div className="fw-semibold mb-1">Тип виробу</div>
                    {kinds.map(k => (
                        <Form.Check
                            className="sidebar__filter__option__container"
                            key={k}
                            type="checkbox"
                            id={`kind-${k}`}
                            label={k}
                            checked={selectedKinds.includes(k)}
                            onChange={() => toggleKind(k)}
                        />
                    ))}
                </div>
            )}

            {showColor && colors.length > 0 && (
                <div className="mb-3">
                    <div className="fw-semibold mb-1">Колір</div>
                    {colors.map(c => (
                        <Form.Check
                            className="sidebar__filter__option__container"
                            key={c}
                            type="checkbox"
                            id={`color-${c}`}
                            label={c}
                            checked={selectedColors.includes(c)}
                            onChange={() => toggleColor(c)}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default ProductFilters;