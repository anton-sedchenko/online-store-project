const commonColors = [
    'Айворі',
    'Світло-сірий',
    'Зелений',
    'Синій',
    'Чорний',
    'Червоний',
    'Коричневий',
    'Сірий',
    'Білий',
];

export const ROZETKA_PARAMS_BY_CATEGORY = {
    // 169828 — Скатерти и салфетки / плейсмати
    '169828': [
        {name: 'Тип', values: ['Сервірувальні килимки'], auto: 'placematType', required: true},
        {name: 'Країна-виробник товару', values: ['Україна'], auto: 'country', required: true},
        {name: 'Матеріал', values: ['Бавовна'], auto: 'material', required: true},
        {name: 'Колір', values: [...commonColors, 'Біло-червоний'], auto: 'color', required: true},
        {name: 'Форма', values: ['Круглі', 'Овальні', 'Прямокутні', 'Квадратні', 'Фігурні'], auto: 'pluralShape', required: true},
        {name: 'Розміри', values: ['13 x 13 см', '15 x 15 см', '20 x 20 см', '23 x 23 см', '24 x 24 см', '30 x 30 см', '31 x 31 см', '37 x 27 см'], auto: 'placematSize'},
        {name: 'Використання', values: ['Текстиль для кухні'], auto: 'placematUsage', required: true},
    ],

    // 4652688 — Корзины для хранения / органайзери
    '4652688': [
        {name: 'Тип', values: ['Один предмет', 'Набір'], auto: 'storageType', required: true},
        {name: 'Країна-виробник товару', values: ['Україна'], auto: 'country', required: true},
        {name: 'Матеріал', values: ['Бавовна', 'Текстиль'], auto: 'material', required: true},
        {name: 'Колір', values: [...commonColors, 'Коричнево-білий', 'Біло-червоний', 'Біло-зелений'], auto: 'color', required: true},
        {name: 'Призначення', values: ['Універсальні', 'Декоративні', 'Для одягу'], auto: 'storagePurpose', required: true},
        {name: 'Форма', values: ['Кругла', 'Овальна', 'Прямокутна', 'Квадратна'], auto: 'singleShape', required: true},
        {name: 'Висота', values: [], auto: 'height'},
        {name: 'Ширина', values: [], auto: 'widthOrDiameter'},
        {name: 'Довжина', values: [], auto: 'lengthOrDiameter'},
        {name: 'Особливості', values: ['З кришкою', 'З ручками', 'Плетені', 'Набір'], auto: 'feature'},
    ],

    // 4626843 — Корзинки / кухонні кошики
    '4626843': [
        {name: 'Тип поставки', values: ['Один предмет', 'Набір'], auto: 'supplyType', required: true},
        {name: 'Країна-виробник товару', values: ['Україна'], auto: 'country', required: true},
        {name: 'Матеріал', values: ['Бавовна', 'Текстиль'], auto: 'material', required: true},
        {name: 'Колір', values: [...commonColors, 'Червоний/Білий'], auto: 'color', required: true},
        {name: 'Форма', values: ['Кругла', 'Овальна', 'Прямокутна', 'Квадратна'], auto: 'singleShape'},
        {name: 'Розміри', values: [], auto: 'sizeText'},
        {name: 'Особливості', values: ['З кришкою', 'З ручкою/З ручками'], auto: 'kitchenFeature'},
    ],

    // 4626841 — близька кухонна категорія
    '4626841': [
        {name: 'Тип поставки', values: ['Один предмет', 'Набір'], auto: 'supplyType', required: true},
        {name: 'Країна-виробник товару', values: ['Україна'], auto: 'country', required: true},
        {name: 'Матеріал', values: ['Бавовна', 'Текстиль'], auto: 'material', required: true},
        {name: 'Колір', values: [...commonColors, 'Червоний/Білий'], auto: 'color', required: true},
        {name: 'Форма', values: ['Кругла', 'Овальна', 'Прямокутна', 'Квадратна'], auto: 'singleShape'},
        {name: 'Розміри', values: [], auto: 'sizeText'},
        {name: 'Особливості', values: ['З кришкою', 'З ручкою/З ручками'], auto: 'kitchenFeature'},
    ],

    // 4674759 — Подставки для посуды / костери
    '4674759': [
        {name: 'Тип', values: ['Підставка під чашку', 'Підставка під гаряче', 'Підставка для зберігання посуду'], auto: 'coasterType', required: true},
        {name: 'Країна-виробник товару', values: ['Україна'], auto: 'country', required: true},
        {name: 'Матеріал', values: ['Бавовна', 'Текстиль'], auto: 'material', required: true},
        {name: 'Колір', values: [...commonColors, 'Біло-червоний'], auto: 'color', required: true},
        {name: 'Форма', values: ['Круглі', 'Овальні', 'Прямокутні', 'Квадратні', 'Фігурні'], auto: 'pluralShape', required: true},
        {name: 'Розміри', values: ['10x10 см', '13x13 см', '13.5x13.5 см', '14x14 см', '15x15 см', '18x18 см'], auto: 'coasterSize'},
    ],

    // 245547 — Вазоны / кашпо
    '245547': [
        {name: 'Тип', values: ['Кашпо'], auto: 'planterType', required: true},
        {name: 'Країна-виробник', values: ['Україна'], auto: 'country', required: true},
        {name: 'Матеріал', values: ['Текстиль'], auto: 'planterMaterial', required: true},
        {name: 'Колір', values: ['Білий', 'Світло-сірий', 'Зелений', 'Синій', 'Чорний', 'Червоний', 'Коричневий', 'Зелений + Білий', 'Біло-зелений', 'Біло-червоний', 'Сірий'], auto: 'color', required: true},
        {name: 'Форма', values: ['Круг', 'Овал', 'Прямокутник', 'Квадрат', 'Фігурна'], auto: 'planterShape', required: true},
        {name: 'Розмір', values: ['Маленькі', 'Середні', 'Великі'], auto: 'planterSize', required: true},
        {name: 'Зовнішні розміри', values: [], auto: 'externalSize'},
        {name: 'Призначення', values: ['Універсальні'], auto: 'planterPurpose', required: true},
        {name: 'Розміщення', values: ['Настільні', 'Кімнатні', 'Підлогові', 'Підвісні', 'Вуличні'], auto: 'planterPlacement', required: true},
        {name: 'Особливості', values: ['Декоративні', 'З піддоном', 'На ніжці'], auto: 'planterFeature'},
    ],
};

const safe = (value) => (value == null ? '' : String(value).trim());
const normalizeForSearch = (value) => safe(value).toLowerCase();

const toNumber = (value) => {
    const normalized = safe(value).replace(',', '.');
    if (!normalized) return null;
    const number = Number(normalized);
    return Number.isNaN(number) ? null : number;
};

const isSetProduct = (product = {}) => {
    const kind = normalizeForSearch(product.kind);
    const name = normalizeForSearch(product.name);
    const features = normalizeForSearch(product.features);

    return kind === 'набір' || name.includes('набір') || features.includes('набір');
};

const getBaseShape = (product = {}) => {
    const shape = normalizeForSearch(product.shape);
    const diameter = toNumber(product.diameter);
    const width = toNumber(product.width);
    const length = toNumber(product.length);

    if (shape.includes('круг')) return 'round';
    if (shape.includes('овал')) return 'oval';
    if (shape.includes('прямокут')) return 'rectangle';
    if (shape.includes('квадрат')) return 'square';
    if (diameter && !width && !length) return 'round';
    if (width && length) return 'rectangle';

    return '';
};

const getSingleShape = (product = {}) => {
    const shape = getBaseShape(product);
    if (shape === 'round') return 'Кругла';
    if (shape === 'oval') return 'Овальна';
    if (shape === 'rectangle') return 'Прямокутна';
    if (shape === 'square') return 'Квадратна';
    return '';
};

const getPluralShape = (product = {}) => {
    const shape = getBaseShape(product);
    if (shape === 'round') return 'Круглі';
    if (shape === 'oval') return 'Овальні';
    if (shape === 'rectangle') return 'Прямокутні';
    if (shape === 'square') return 'Квадратні';
    return '';
};

const getPlanterShape = (product = {}) => {
    const shape = getBaseShape(product);
    if (shape === 'round') return 'Круг';
    if (shape === 'oval') return 'Овал';
    if (shape === 'rectangle') return 'Прямокутник';
    if (shape === 'square') return 'Квадрат';
    return '';
};

const normalizeMaterial = (product = {}) => {
    const material = normalizeForSearch(product.material);
    if (!material) return '';
    if (material.includes('бавов') || material.includes('шнур')) return 'Бавовна';
    return safe(product.material);
};

const normalizePlanterMaterial = (product = {}) => {
    const material = normalizeForSearch(product.material);
    if (!material) return '';
    if (material.includes('бавов') || material.includes('шнур')) return 'Текстиль';
    return safe(product.material);
};

const normalizeColor = (product = {}, categoryId = '') => {
    const color = normalizeForSearch(product.color);
    if (!color) return '';

    // Якщо на сайті стоїть “Комбінований”, свідомо не вгадуємо.
    // У такому випадку продавець має вибрати точний marketplace-колір у селекті.
    if (color.includes('комб')) return '';

    const text = `${color} ${normalizeForSearch(product.name)} ${normalizeForSearch(product.description)}`;
    const hasWhite = text.includes('бі') || text.includes('айвор') || text.includes('ivory');
    const hasRed = text.includes('черв') || text.includes('rosso');
    const hasGreen = text.includes('зел') || text.includes('шавл') || text.includes('олив') || text.includes('verde');
    const hasBrown = text.includes('корич') || text.includes('шокол') || text.includes('глин') || text.includes('карам') || text.includes('terra') || text.includes('caramello');
    const hasBlue = text.includes('син') || text.includes('блак') || text.includes('blue') || text.includes('azzurro');
    const hasGray = text.includes('сір') || text.includes('nebbia');
    const hasBlack = text.includes('чор');

    if (hasRed && hasWhite) {
        if (categoryId === '4626843' || categoryId === '4626841') return 'Червоний/Білий';
        if (categoryId === '4652688' || categoryId === '4674759' || categoryId === '245547') return 'Біло-червоний';
        return 'Червоний';
    }

    if (hasGreen && hasWhite) {
        if (categoryId === '245547') return 'Зелений + Білий';
        if (categoryId === '4652688') return 'Біло-зелений';
        return 'Зелений';
    }

    if (hasBrown && hasWhite) {
        if (categoryId === '4652688') return 'Коричнево-білий';
        return 'Коричневий';
    }

    if (hasGray && hasBlack) return 'Сірий';
    if (color.includes('айвор')) return categoryId === '245547' ? 'Білий' : 'Айворі';
    if (color.includes('світло') && color.includes('сір')) return 'Світло-сірий';
    if (hasGreen) return 'Зелений';
    if (hasRed) return 'Червоний';
    if (hasBlack) return 'Чорний';
    if (hasBlue) return 'Синій';
    if (hasGray) return 'Світло-сірий';
    if (hasBrown) return 'Коричневий';
    if (color.includes('білий')) return 'Білий';

    return safe(product.color);
};

const normalizeStoragePurpose = (product = {}) => {
    const purpose = normalizeForSearch(product.purpose);
    if (!purpose) return '';
    if (purpose.includes('декор')) return 'Декоративні';
    if (purpose.includes('білиз') || purpose.includes('одяг')) return 'Для одягу';
    return 'Універсальні';
};

const firstFeature = (product = {}, mode = 'storage') => {
    const features = normalizeForSearch(product.features);

    if (mode === 'kitchen') {
        if (features.includes('криш')) return 'З кришкою';
        if (features.includes('ручк')) return 'З ручкою/З ручками';
        return '';
    }

    if (mode === 'planter') {
        return 'Декоративні';
    }

    if (features.includes('криш')) return 'З кришкою';
    if (features.includes('ручк')) return 'З ручками';
    if (features.includes('плет')) return 'Плетені';
    if (features.includes('набір')) return 'Набір';
    return '';
};

const buildSizeText = (product = {}, separator = '×') => {
    const width = toNumber(product.width);
    const length = toNumber(product.length);
    const height = toNumber(product.height);
    const diameter = toNumber(product.diameter);

    if (width && length && height) return `${length}${separator}${width}${separator}${height} см`;
    if (width && length) return `${length}${separator}${width} см`;
    if (diameter && height) return `${diameter}${separator}${diameter}${separator}${height} см`;
    if (diameter) return `${diameter}${separator}${diameter} см`;
    return '';
};

const getPlanterSize = (product = {}) => {
    const maxSide = Math.max(
        toNumber(product.width) || 0,
        toNumber(product.length) || 0,
        toNumber(product.height) || 0,
        toNumber(product.diameter) || 0,
    );

    if (!maxSide) return '';
    if (maxSide <= 15) return 'Маленькі';
    if (maxSide <= 25) return 'Середні';
    return 'Великі';
};

const getAutoValue = (autoKey, product = {}, categoryId = '') => {
    switch (autoKey) {
        case 'country':
            return safe(product.country) || 'Україна';
        case 'material':
            return normalizeMaterial(product);
        case 'planterMaterial':
            return normalizePlanterMaterial(product);
        case 'color':
            return normalizeColor(product, categoryId);
        case 'singleShape':
            return getSingleShape(product);
        case 'pluralShape':
            return getPluralShape(product);
        case 'planterShape':
            return getPlanterShape(product);
        case 'height':
            return safe(product.height);
        case 'widthOrDiameter':
            return safe(product.width) || safe(product.diameter);
        case 'lengthOrDiameter':
            return safe(product.length) || safe(product.diameter);
        case 'sizeText':
            return isSetProduct(product) ? '' : buildSizeText(product, '×');
        case 'placematSize':
            return buildSizeText(product, ' x ');
        case 'coasterSize':
            return buildSizeText(product, 'x');
        case 'externalSize':
            return buildSizeText(product, '×');
        case 'storageType':
        case 'supplyType':
            return isSetProduct(product) ? 'Набір' : 'Один предмет';
        case 'placematType':
            return 'Сервірувальні килимки';
        case 'coasterType':
            return 'Підставка під чашку';
        case 'planterType':
            return 'Кашпо';
        case 'placematUsage':
            return 'Текстиль для кухні';
        case 'storagePurpose':
            return normalizeStoragePurpose(product);
        case 'planterPurpose':
            return 'Універсальні';
        case 'planterPlacement':
            return 'Настільні';
        case 'planterSize':
            return getPlanterSize(product);
        case 'feature':
            return firstFeature(product, 'storage');
        case 'kitchenFeature':
            return firstFeature(product, 'kitchen');
        case 'planterFeature':
            return firstFeature(product, 'planter');
        default:
            return '';
    }
};

export const getRozetkaParamsForCategory = (categoryId) => {
    const key = safe(categoryId);
    return ROZETKA_PARAMS_BY_CATEGORY[key] || null;
};

export const getRozetkaFieldsForCategory = (categoryId) => {
    return getRozetkaParamsForCategory(categoryId) || [];
};

export const getRozetkaParamValues = (categoryId, paramName) => {
    const field = getRozetkaFieldsForCategory(categoryId).find(item => item.name === paramName);
    return field?.values || [];
};

export const buildRozetkaMarketplaceParams = (categoryId, product = {}) => {
    return getRozetkaFieldsForCategory(categoryId).map(field => ({
        marketplace: 'rozetka',
        name: field.name,
        value: getAutoValue(field.auto, product, safe(categoryId)),
    }));
};

export const mergeRozetkaParamsWithTemplate = (categoryId, existingParams = [], product = {}, options = {}) => {
    const {preserveExistingValues = true} = options;
    const template = buildRozetkaMarketplaceParams(categoryId, product);
    const existingMap = new Map(
        (existingParams || [])
            .filter(item => safe(item.name))
            .map(item => [safe(item.name), safe(item.value)])
    );

    return template.map(item => {
        const existingValue = existingMap.get(item.name);
        if (preserveExistingValues && existingValue) {
            return {...item, value: existingValue};
        }
        return item;
    });
};

export const prepareMarketplaceParamsForSubmit = (params = []) => {
    return (params || [])
        .map(item => ({
            marketplace: 'rozetka',
            name: safe(item.name),
            value: safe(item.value),
        }))
        .filter(item => item.name && item.value);
};
