import React from 'react';
import {Form} from 'react-bootstrap';

const VISIBLE_CATEGORY_NAMES = [
'Для дітей',
'Багатоцільові органайзери',
'Кошики для ванної',
'Кошики для кухні',
];

const getProductCategory = (product) => {
return (
product?.type?.name ||
product?.Type?.name ||
product?.typeName ||
''
);
};

const ProductFilter = ({
products,
selectedCategories,
setSelectedCategories,
selectedKinds,
setSelectedKinds,
selectedColors,
setSelectedColors,
}) => {
const safeProducts = Array.isArray(products) ? products : [];

const categories = [
    ...new Set(
        safeProducts
            .map(getProductCategory)
            .filter(name => VISIBLE_CATEGORY_NAMES.includes(name))
    )
];

const kinds = [
    ...new Set(
        safeProducts
            .map(product => product?.kind)
            .filter(Boolean)
    )
];

const colors = [
    ...new Set(
        safeProducts
            .map(product => product?.color)
            .filter(Boolean)
    )
];

const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
        setSelectedCategories(
            selectedCategories.filter(item => item !== category)
        );
    } else {
        setSelectedCategories([
            ...selectedCategories,
            category
        ]);
    }
};

const toggleKind = (kind) => {
    if (selectedKinds.includes(kind)) {
        setSelectedKinds(
            selectedKinds.filter(item => item !== kind)
        );
    } else {
        setSelectedKinds([
            ...selectedKinds,
            kind
        ]);
    }
};

const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
        setSelectedColors(
            selectedColors.filter(item => item !== color)
        );
    } else {
        setSelectedColors([
            ...selectedColors,
            color
        ]);
    }
};

if (
    !categories.length &&
    !kinds.length &&
    !colors.length
) {
    return null;
}

return (
    <div className="sidebar__filters">
        <h5 className="sidebar__section__title">
            Фільтри
        </h5>

        {categories.length > 0 && (
            <div className="sidebar__filter__group">
                <div className="sidebar__filter__group__title">
                    Категорія
                </div>

                <div className="sidebar__filter__option__container">
                    {categories.map(category => {
                        const inputId =
                            `category-${category
                                .replace(/\s+/g, '-')
                                .toLowerCase()}`;

                        return (
                            <Form.Check
                                key={category}
                                id={inputId}
                                type="checkbox"
                                label={category}
                                className="sidebar__filter__check"
                                checked={selectedCategories.includes(
                                    category
                                )}
                                onChange={() =>
                                    toggleCategory(category)
                                }
                            />
                        );
                    })}
                </div>
            </div>
        )}

        {kinds.length > 0 && (
            <div className="sidebar__filter__group">
                <div className="sidebar__filter__group__title">
                    Тип виробу
                </div>

                <div className="sidebar__filter__option__container">
                    {kinds.map(kind => {
                        const inputId =
                            `kind-${kind
                                .replace(/\s+/g, '-')
                                .toLowerCase()}`;

                        return (
                            <Form.Check
                                key={kind}
                                id={inputId}
                                type="checkbox"
                                label={kind}
                                className="sidebar__filter__check"
                                checked={selectedKinds.includes(kind)}
                                onChange={() => toggleKind(kind)}
                            />
                        );
                    })}
                </div>
            </div>
        )}

        {colors.length > 0 && (
            <div className="sidebar__filter__group">
                <div className="sidebar__filter__group__title">
                    Колір
                </div>

                <div className="sidebar__filter__option__container">
                    {colors.map(color => {
                        const inputId =
                            `color-${color
                                .replace(/\s+/g, '-')
                                .toLowerCase()}`;

                        return (
                            <Form.Check
                                key={color}
                                id={inputId}
                                type="checkbox"
                                label={color}
                                className="sidebar__filter__check"
                                checked={selectedColors.includes(color)}
                                onChange={() => toggleColor(color)}
                            />
                        );
                    })}
                </div>
            </div>
        )}
    </div>
);

};

export default ProductFilter;
