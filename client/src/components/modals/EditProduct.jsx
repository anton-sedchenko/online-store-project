import React, {useMemo, useState, useEffect} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {updateProduct, fetchProducts, deleteProductImage} from '../../http/productAPI.js';
import {fetchTypes} from '../../http/typeAPI.js';
import {
    buildRozetkaMarketplaceParams,
    getRozetkaFieldsForCategory,
    getRozetkaParamValues,
    mergeRozetkaParamsWithTemplate,
    prepareMarketplaceParamsForSubmit,
} from '../../utils/rozetkaParams.js';
import {AVAILABILITY_STATUSES, availabilityOptions, isKnownAvailability} from '../../utils/availability.js';

const KIND_OPTIONS = ['Кошик', 'Плейсмат', 'Костер', 'Кашпо', 'Набір'];
const MATERIAL_OPTIONS = ['Бавовна'];
const COLOR_OPTIONS = ['Айворі', 'Світло-сірий', 'Зелений',  'Чорний', 'Червоний', 'Коричневий', 'Комбінований'];
const SHAPE_OPTIONS = ['Кругла', 'Овальна', 'Прямокутна'];
const PURPOSE_OPTIONS = ['Для ванної', 'Для кухні', 'Для зберігання', 'Універсальне', 'Декоративне'];
const FEATURE_OPTIONS = ['З кришкою', 'З ручками', 'Плетений', 'Набір'];

const parseFeatures = (value) => {
    if (!value) return [];
    return String(value)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
};

const parseMarketplaceParams = (params) => {
    if (!Array.isArray(params)) return [];

    return params
        .filter(item => String(item.marketplace || 'rozetka').trim() === 'rozetka')
        .map(item => ({
            marketplace: 'rozetka',
            name: String(item.name || '').trim(),
            value: String(item.value || '').trim(),
        }))
        .filter(item => item.name);
};

const EditProduct = ({show, onHide, productToEdit}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [code, setCode] = useState('');
    const [color, setColor] = useState('');
    const [kind, setKind] = useState('');
    const [shape, setShape] = useState('');
    const [purpose, setPurpose] = useState('');
    const [features, setFeatures] = useState([]);
    const [description, setDescription] = useState('');
    const [imgFiles, setImgFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [availability, setAvailability] = useState(AVAILABILITY_STATUSES.IN_STOCK);
    const [rozetkaCategoryId, setRozetkaCategoryId] = useState('');
    const [rating, setRating] = useState(1);
    const [width, setWidth] = useState('');
    const [length, setLength] = useState('');
    const [height, setHeight] = useState('');
    const [diameter, setDiameter] = useState('');
    const [weightKg, setWeightKg] = useState('');
    const [country, setCountry] = useState('Україна');
    const [material, setMaterial] = useState('');
    const [types, setTypes] = useState([]);
    const [typeId, setTypeId] = useState('');
    const [marketplaceParams, setMarketplaceParams] = useState([]);

    useEffect(() => {
        if (show) {
            fetchTypes()
                .then(data => setTypes(Array.isArray(data) ? data : []))
                .catch(() => setTypes([]));
        }
    }, [show]);

    const normalizedFeatures = useMemo(() => features.filter(Boolean), [features]);

    const productSnapshot = useMemo(() => ({
        name,
        description,
        color,
        kind,
        shape,
        purpose,
        features: normalizedFeatures.join(', '),
        width,
        length,
        height,
        diameter,
        country,
        material,
    }), [name, description, color, kind, shape, purpose, normalizedFeatures, width, length, height, diameter, country, material]);

    const rozetkaFields = useMemo(
        () => getRozetkaFieldsForCategory(rozetkaCategoryId),
        [rozetkaCategoryId]
    );

    const hasRozetkaTemplate = rozetkaCategoryId && rozetkaFields.length > 0;

    useEffect(() => {
        if (productToEdit) {
            const initialFeatures = parseFeatures(productToEdit.features);
            const initialRozetkaCategoryId = productToEdit.rozetkaCategoryId ? String(productToEdit.rozetkaCategoryId) : '';
            const initialProductSnapshot = {
                name: productToEdit.name || '',
                description: productToEdit.description || '',
                color: productToEdit.color || '',
                kind: productToEdit.kind || '',
                shape: productToEdit.shape || '',
                purpose: productToEdit.purpose || '',
                features: initialFeatures.join(', '),
                width: productToEdit.width || '',
                length: productToEdit.length || '',
                height: productToEdit.height || '',
                diameter: productToEdit.diameter || '',
                country: productToEdit.country || 'Україна',
                material: productToEdit.material || '',
            };

            setName(productToEdit.name || '');
            setPrice(productToEdit.price || '');
            setCode(productToEdit.code || '');
            setColor(productToEdit.color || '');
            setKind(productToEdit.kind || '');
            setShape(productToEdit.shape || '');
            setPurpose(productToEdit.purpose || '');
            setFeatures(initialFeatures);
            setDescription(productToEdit.description || '');
            setExistingImages(Array.isArray(productToEdit.images) ? productToEdit.images : []);
            setMainImageUrl(productToEdit.img || '');
            setRozetkaCategoryId(initialRozetkaCategoryId);
            setAvailability(isKnownAvailability(productToEdit.availability) ? productToEdit.availability : '');
            setRating(productToEdit.rating ?? 1);
            setWidth(productToEdit.width || '');
            setLength(productToEdit.length || '');
            setHeight(productToEdit.height || '');
            setDiameter(productToEdit.diameter || '');
            setWeightKg(productToEdit.weightKg || '');
            setCountry(productToEdit.country || 'Україна');
            setMaterial(productToEdit.material || '');
            setTypeId(productToEdit.typeId ? String(productToEdit.typeId) : '');
            setImgFiles([]);
            setMainImageFile(null);
            setMarketplaceParams(mergeRozetkaParamsWithTemplate(
                initialRozetkaCategoryId,
                parseMarketplaceParams(productToEdit.marketplaceParams),
                initialProductSnapshot,
                {preserveExistingValues: true}
            ));
        }
    }, [productToEdit]);

    const handleFeaturesChange = (e) => {
        const values = Array.from(e.target.selectedOptions).map(option => option.value);
        setFeatures(values);
    };

    const handleRozetkaCategoryChange = (value) => {
        setRozetkaCategoryId(value);
        setMarketplaceParams(buildRozetkaMarketplaceParams(value, productSnapshot));
    };

    const updateRozetkaParamValue = (index, value) => {
        setMarketplaceParams(prev => prev.map((item, itemIndex) => (
            itemIndex === index ? {...item, value} : item
        )));
    };

    const refreshRozetkaParams = (preserveExistingValues = true) => {
        setMarketplaceParams(prev => mergeRozetkaParamsWithTemplate(
            rozetkaCategoryId,
            prev,
            productSnapshot,
            {preserveExistingValues}
        ));
    };

    const clearRozetkaParams = () => {
        setMarketplaceParams(buildRozetkaMarketplaceParams(rozetkaCategoryId, productSnapshot));
    };

    const handleSave = async () => {
        if (!typeId) {
            alert('Оберіть категорію товару');
            return;
        }

        if (!isKnownAvailability(availability)) {
            alert('Оберіть коректний статус наявності');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('code', code);
            formData.append('typeId', typeId);
            formData.append('color', (color ?? '').trim());
            formData.append('kind', (kind ?? '').trim());
            formData.append('shape', (shape ?? '').trim());
            formData.append('purpose', (purpose ?? '').trim());
            formData.append('features', normalizedFeatures.join(', '));
            formData.append('description', description);
            formData.append('availability', availability);
            formData.append('width', (width ?? '').trim());
            formData.append('length', (length ?? '').trim());
            formData.append('height', (height ?? '').trim());
            formData.append('diameter', (diameter ?? '').trim());
            formData.append('weightKg', (weightKg ?? '').trim());
            formData.append('country', (country ?? 'Україна').trim());
            formData.append('material', (material ?? '').trim());
            formData.append('rozetkaCategoryId', (rozetkaCategoryId ?? '').trim());
            formData.append('rating', String(rating ?? 1));
            formData.append('marketplaceParams', JSON.stringify(prepareMarketplaceParamsForSubmit(marketplaceParams)));

            if (mainImageFile) {
                formData.append('img', mainImageFile);
            }

            imgFiles.forEach((file) => {
                formData.append('images', file);
            });

            await updateProduct(productToEdit.id, formData);
            onHide();
            fetchProducts(null, 1, 8).then(() => {});
        } catch (e) {
            alert(e.response?.data?.message || e.message);
        }
    };

    const handleDeleteImage = async (imageId) => {
        try {
            await deleteProductImage(imageId);
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
        } catch (e) {
            alert(e.response?.data?.message || e.message);
        }
    };

    const renderRozetkaParams = () => {
        if (!rozetkaCategoryId) {
            return <Form.Text muted>Спочатку вкажіть ID категорії Rozetka.</Form.Text>;
        }

        if (!hasRozetkaTemplate) {
            return (
                <Form.Text className="text-danger">
                    Для цієї категорії ще немає локального довідника значень.
                </Form.Text>
            );
        }

        return marketplaceParams.map((item, index) => {
            const values = getRozetkaParamValues(rozetkaCategoryId, item.name);
            const field = rozetkaFields.find(param => param.name === item.name);
            const hasPresetValues = values.length > 0;
            const isRequired = Boolean(field?.required);

            return (
                <Form.Group key={`${item.name}-${index}`} className="mb-2">
                    <Form.Label className="mb-1">
                        {item.name}{isRequired ? ' *' : ''}
                    </Form.Label>

                    {hasPresetValues ? (
                        <Form.Select
                            value={item.value}
                            onChange={e => updateRozetkaParamValue(index, e.target.value)}
                        >
                            <option value="">Оберіть значення</option>
                            {values.map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Form.Select>
                    ) : (
                        <Form.Control
                            value={item.value}
                            placeholder="Вкажіть значення"
                            onChange={e => updateRozetkaParamValue(index, e.target.value)}
                        />
                    )}
                </Form.Group>
            );
        });
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Редагування товару</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Назва</Form.Label>
                        <Form.Control value={name} onChange={e => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Ціна</Form.Label>
                        <Form.Control type="number" value={price} onChange={e => setPrice(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Код товару</Form.Label>
                        <Form.Control value={code} onChange={e => setCode(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Категорія товару</Form.Label>
                        <Form.Select value={typeId} onChange={e => setTypeId(e.target.value)}>
                            <option value="">Оберіть категорію</option>
                            {types.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Наявність</Form.Label>
                        <Form.Select value={availability} onChange={e => setAvailability(e.target.value)}>
                            {availabilityOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Рейтинг (1–10)</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            max={10}
                            value={rating}
                            onChange={e => setRating(Number(e.target.value))}
                            onWheel={(e) => e.currentTarget.blur()}
                        />
                    </Form.Group>

                    <div className="border rounded p-3 mb-3 bg-white">
                        <strong>Характеристики для сайту</strong>
                        <div className="text-muted small">Ці поля показуються на сайті та використовуються для фільтрів. Для Rozetka нижче є окремий блок.</div>
                    </div>

                    <Form.Group className="mb-2">
                        <Form.Label>Тип виробу для сайту</Form.Label>
                        <Form.Select value={kind} onChange={e => setKind(e.target.value)}>
                            <option value="">Оберіть тип</option>
                            {KIND_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Колір для сайту</Form.Label>
                        <Form.Select value={color} onChange={e => setColor(e.target.value)}>
                            <option value="">Оберіть колір</option>
                            {COLOR_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Матеріал для сайту</Form.Label>
                        <Form.Select value={material} onChange={e => setMaterial(e.target.value)}>
                            <option value="">Оберіть матеріал</option>
                            {MATERIAL_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Форма для сайту</Form.Label>
                        <Form.Select value={shape} onChange={e => setShape(e.target.value)}>
                            <option value="">Оберіть форму</option>
                            {SHAPE_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Призначення для сайту</Form.Label>
                        <Form.Select value={purpose} onChange={e => setPurpose(e.target.value)}>
                            <option value="">Оберіть призначення</option>
                            {PURPOSE_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Особливості для сайту</Form.Label>
                        <Form.Select multiple value={features} onChange={handleFeaturesChange}>
                            {FEATURE_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>

                        <div className="mt-2 d-flex gap-2 align-items-center">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                type="button"
                                onClick={() => setFeatures([])}
                            >
                                Очистити особливості
                            </Button>

                            <Form.Text muted className="mb-0">
                                Можна обрати кілька значень, утримуючи Ctrl.
                            </Form.Text>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Розміри для сайту (см)</Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Control
                                placeholder="Ширина"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                            />
                            <Form.Control
                                placeholder="Довжина"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                            />
                            <Form.Control
                                placeholder="Висота"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <div className="d-flex gap-2">
                            <Form.Control
                                placeholder="Діаметр (см)"
                                value={diameter}
                                onChange={(e) => setDiameter(e.target.value)}
                            />
                            <Form.Control
                                placeholder="Вага (кг)"
                                value={weightKg}
                                onChange={(e) => setWeightKg(e.target.value)}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Країна виробник</Form.Label>
                        <Form.Control
                            placeholder="Україна"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>ID категорії Rozetka</Form.Label>
                        <Form.Control
                            type="number"
                            inputMode="numeric"
                            placeholder="Напр.: 4652688"
                            value={rozetkaCategoryId}
                            onChange={e => handleRozetkaCategoryChange(e.target.value)}
                        />
                    </Form.Group>

                    <div className="border rounded p-3 mb-3 bg-light">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                            <div>
                                <strong>Характеристики для Rozetka</strong>
                                <div className="text-muted small">
                                    Поля формуються автоматично за ID категорії Rozetka. Назви характеристик не редагуються, щоб не було помилок у XML.
                                </div>
                            </div>
                            <div className="d-flex gap-2 flex-wrap justify-content-end">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    type="button"
                                    disabled={!hasRozetkaTemplate}
                                    onClick={() => refreshRozetkaParams(true)}
                                >
                                    Оновити автозначення
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    type="button"
                                    disabled={!hasRozetkaTemplate}
                                    onClick={clearRozetkaParams}
                                >
                                    Скинути
                                </Button>
                            </div>
                        </div>

                        {renderRozetkaParams()}
                    </div>



                    <Form.Group className="mb-2">
                        <Form.Label>Опис товару</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Головне зображення</Form.Label>
                        {mainImageUrl && (
                            <div className="mb-2">
                                <img src={mainImageUrl} alt="main" style={{width: '100px'}} />
                            </div>
                        )}
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={e => setMainImageFile(e.target.files[0])}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Додаткові зображення</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={e => setImgFiles(Array.from(e.target.files))}
                        />
                    </Form.Group>

                    <div className="existing-images">
                        {existingImages.map(img => (
                            <div key={img.id} className="img-thumb-wrapper">
                                <img src={img.url} alt="existing" className="img-thumb" />
                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => handleDeleteImage(img.id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Відмінити
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Зберегти
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditProduct;
