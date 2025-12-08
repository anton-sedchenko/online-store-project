import React, { useMemo } from 'react';
import { Form } from 'react-bootstrap';

// які фільтри вмикаємо для кожної категорії (по імені type.name)
const CATEGORY_FILTERS = {
    'Гіпсові фігурки': { color: false, kind: true, isSet: true },
    'Вироби зі шнура': { color: true,  kind: true, isSet: true },
    'Вироби з бісеру': { color: false, kind: true, isSet: true },
};

const CategoryFilters = ({
                             products,
                             categoryName,
                             selectedKinds,
                             setSelectedKinds,
                             selectedColors,
                             setSelectedColors,
                             onlySets,
                             setOnlySets,
                         }) => {
    const config = CATEGORY_FILTERS[categoryName] || {};
    const showColor = config.color;
    const showKind  = config.kind;
    const showIsSet = config.isSet;

    const kinds = useMemo(
        () => [...new Set((products || []).map(p => p.kind).filter(Boolean))],
        [products]
    );

    const colors = useMemo(
        () => [...new Set((products || []).map(p => p.color).filter(Boolean))],
        [products]
    );

    const hasSets = useMemo(
        () => (products || []).some(p => p.isSet),
        [products]
    );

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

    // якщо для цієї категорії нема активних фільтрів — взагалі нічого не рендеримо
    if (!showColor && !showKind && !(showIsSet && hasSets)) {
        return null;
    }

    return (
        <div className="mt-4">
            {showKind && kinds.length > 0 && (
                <div className="mb-3">
                    <div className="fw-semibold mb-1">Тип виробу</div>
                    {kinds.map(k => (
                        <Form.Check
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

            {showIsSet && hasSets && (
                <div className="mb-2">
                    <Form.Check
                        type="checkbox"
                        id="only-sets"
                        label="Показати лише набори"
                        checked={onlySets}
                        onChange={e => setOnlySets(e.target.checked)}
                    />
                </div>
            )}
        </div>
    );
};

export default CategoryFilters;