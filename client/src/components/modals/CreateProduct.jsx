import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createProduct} from "../../http/productAPI.js";
import {fetchTypes} from "../../http/typeAPI.js";
import {observer} from "mobx-react-lite";
import {
    buildRozetkaMarketplaceParams,
    getRozetkaFieldsForCategory,
    getRozetkaParamValues,
    mergeRozetkaParamsWithTemplate,
    prepareMarketplaceParamsForSubmit,
} from "../../utils/rozetkaParams.js";
import {AVAILABILITY_STATUSES, availabilityOptions} from "../../utils/availability.js";

const KIND_OPTIONS = ['Кошик', 'Плейсмат', 'Костер', 'Кашпо', 'Набір'];
const MATERIAL_OPTIONS = ['Бавовна'];
const COLOR_OPTIONS = ['Айворі', 'Світло-сірий', 'Зелений', 'Чорний', 'Червоний', 'Коричневий', 'Комбінований'];
const SHAPE_OPTIONS = ['Кругла', 'Овальна', 'Прямокутна'];
const PURPOSE_OPTIONS = ['Для ванної', 'Для кухні', 'Для зберігання', 'Універсальне', 'Декоративне'];
const FEATURE_OPTIONS = ['З кришкою', 'З ручками', 'Плетений', 'Набір'];

const CreateProduct = observer(({show, onHide}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [descr, setDescr] = useState('');
    const [color, setColor] = useState('');
    const [kind, setKind] = useState('');
    const [shape, setShape] = useState('');
    const [purpose, setPurpose] = useState('');
    const [features, setFeatures] = useState([]);
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState('');
    const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [code, setCode] = useState('');
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
    const previewUrlsRef = useRef(new Set());
    const mainImageInputRef = useRef(null);
    const additionalImagesInputRef = useRef(null);

    const getFileSignature = (imageFile) => (
        imageFile ? `${imageFile.name}:${imageFile.size}:${imageFile.lastModified}` : ''
    );

    const createPreviewUrl = (imageFile) => {
        const previewUrl = URL.createObjectURL(imageFile);
        previewUrlsRef.current.add(previewUrl);
        return previewUrl;
    };

    const revokePreviewUrl = (previewUrl) => {
        if (!previewUrl) return;
        URL.revokeObjectURL(previewUrl);
        previewUrlsRef.current.delete(previewUrl);
    };

    const revokeAllPreviewUrls = () => {
        previewUrlsRef.current.forEach((previewUrl) => {
            URL.revokeObjectURL(previewUrl);
        });
        previewUrlsRef.current.clear();
    };

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
        description: descr,
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
    }), [name, descr, color, kind, shape, purpose, normalizedFeatures, width, length, height, diameter, country, material]);

    const rozetkaFields = useMemo(
        () => getRozetkaFieldsForCategory(rozetkaCategoryId),
        [rozetkaCategoryId]
    );

    const hasRozetkaTemplate = rozetkaCategoryId && rozetkaFields.length > 0;

    useEffect(() => () => {
        revokeAllPreviewUrls();
    }, []);

    const resetForm = () => {
        revokeAllPreviewUrls();
        setName('');
        setPrice(0);
        setDescr('');
        setColor('');
        setKind('');
        setShape('');
        setPurpose('');
        setFeatures([]);
        setMainImageFile(null);
        setMainImagePreviewUrl('');
        setAdditionalImageFiles([]);
        setIsSubmitting(false);
        if (mainImageInputRef.current) mainImageInputRef.current.value = '';
        if (additionalImagesInputRef.current) additionalImagesInputRef.current.value = '';
        setCode('');
        setAvailability(AVAILABILITY_STATUSES.IN_STOCK);
        setRozetkaCategoryId('');
        setRating(1);
        setWidth('');
        setLength('');
        setHeight('');
        setDiameter('');
        setWeightKg('');
        setCountry('Україна');
        setMaterial('');
        setTypeId('');
        setMarketplaceParams([]);
    };

    const selectMainImage = (e) => {
        const selectedFile = e.target.files?.[0] || null;

        revokePreviewUrl(mainImagePreviewUrl);

        if (!selectedFile) {
            setMainImageFile(null);
            setMainImagePreviewUrl('');
            return;
        }

        const mainSignature = getFileSignature(selectedFile);
        setMainImageFile(selectedFile);
        setMainImagePreviewUrl(createPreviewUrl(selectedFile));
        setAdditionalImageFiles(prev => prev.filter((item) => {
            const shouldKeep = item.signature !== mainSignature;
            if (!shouldKeep) revokePreviewUrl(item.previewUrl);
            return shouldKeep;
        }));
    };

    const selectAdditionalImages = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        const mainSignature = getFileSignature(mainImageFile);

        setAdditionalImageFiles(prev => {
            const knownSignatures = new Set(prev.map(item => item.signature));
            const nextFiles = [...prev];

            selectedFiles.forEach((selectedFile) => {
                const signature = getFileSignature(selectedFile);

                if (!signature || signature === mainSignature || knownSignatures.has(signature)) {
                    return;
                }

                knownSignatures.add(signature);
                nextFiles.push({
                    file: selectedFile,
                    previewUrl: createPreviewUrl(selectedFile),
                    signature,
                });
            });

            return nextFiles;
        });

        e.target.value = '';
    };

    const removeAdditionalImage = (signature) => {
        setAdditionalImageFiles(prev => prev.filter((item) => {
            const shouldKeep = item.signature !== signature;
            if (!shouldKeep) revokePreviewUrl(item.previewUrl);
            return shouldKeep;
        }));
    };

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

    const addProduct = async () => {
        if (isSubmitting) {
            return;
        }

        if (!mainImageFile) {
            alert("Додайте зображення товару");
            return;
        }

        if (!typeId) {
            alert("Оберіть категорію товару");
            return;
        }

        if (!availabilityOptions.some(option => option.value === availability)) {
            alert("Оберіть коректний статус наявності");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", `${price}`);
            formData.append("typeId", typeId);
            formData.append("description", descr || "");
            formData.append("img", mainImageFile);
            formData.append("code", code);
            formData.append("availability", availability);
            formData.append("color", (color ?? '').trim());
            formData.append("kind", (kind ?? '').trim());
            formData.append("shape", (shape ?? '').trim());
            formData.append("purpose", (purpose ?? '').trim());
            formData.append("features", normalizedFeatures.join(', '));
            formData.append("rozetkaCategoryId", (rozetkaCategoryId ?? '').trim());
            formData.append("rating", String(rating ?? 1));
            formData.append("width", (width ?? '').trim());
            formData.append("length", (length ?? '').trim());
            formData.append("height", (height ?? '').trim());
            formData.append("diameter", (diameter ?? '').trim());
            formData.append("weightKg", (weightKg ?? '').trim());
            formData.append("country", (country ?? 'Україна').trim());
            formData.append("material", (material ?? '').trim());
            formData.append("marketplaceParams", JSON.stringify(prepareMarketplaceParamsForSubmit(marketplaceParams)));
            additionalImageFiles.forEach(({file: additionalFile}) => {
                formData.append("images", additionalFile);
            });

            setIsSubmitting(true);
            await createProduct(formData);
            resetForm();
            onHide();
        } catch (e) {
            alert(e.response?.data?.message || e.message);
        } finally {
            setIsSubmitting(false);
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
                <Modal.Title>Додати товар</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        placeholder="Назва товару"
                        className="modal__input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    <Form.Control
                        placeholder="Код товару"
                        className="modal__input"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                    />

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

                    <Form.Group className="mb-2">
                        <Form.Label>Наявність</Form.Label>
                        <Form.Select value={availability} onChange={e => setAvailability(e.target.value)}>
                            {availabilityOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Form.Select>
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
                            placeholder="Наприклад: 4652688"
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



                    <Form.Control
                        placeholder="Ціна товару"
                        type="number"
                        className="modal__input"
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                    />

                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Опис товару"
                        className="modal__input"
                        value={descr}
                        onChange={e => setDescr(e.target.value)}
                    />

                    <div className="border rounded p-3 mb-3 bg-light">
                        <Form.Group className="mb-3" controlId="create-product-main-image">
                            <Form.Label>Головне зображення</Form.Label>
                            <Form.Text muted className="d-block mb-2">
                                Це фото буде основним у каталозі та першим у галереї товару.
                            </Form.Text>
                            <Form.Control
                                ref={mainImageInputRef}
                                type="file"
                                accept="image/*"
                                required
                                className="modal__input"
                                onChange={selectMainImage}
                            />
                            {mainImagePreviewUrl && (
                                <div className="mt-3 d-inline-block">
                                    <img
                                        src={mainImagePreviewUrl}
                                        alt="Попередній перегляд головного фото"
                                        style={{width: '140px', maxWidth: '100%', height: '140px', objectFit: 'cover'}}
                                        className="rounded border"
                                    />
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group controlId="create-product-additional-images">
                            <Form.Label>Додаткові зображення</Form.Label>
                            <Form.Text muted className="d-block mb-2">
                                Можна вибрати кілька фото. Головне фото автоматично буде першим у галереї — не додавайте його повторно.
                            </Form.Text>
                            <Form.Control
                                ref={additionalImagesInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="modal__input"
                                onChange={selectAdditionalImages}
                            />
                            {additionalImageFiles.length > 0 && (
                                <div className="d-flex flex-wrap gap-2 mt-3">
                                    {additionalImageFiles.map((item, index) => (
                                        <div key={item.signature} className="position-relative">
                                            <img
                                                src={item.previewUrl}
                                                alt={`Попередній перегляд додаткового фото ${index + 1}`}
                                                style={{width: '96px', height: '96px', objectFit: 'cover'}}
                                                className="rounded border"
                                            />
                                            <Button
                                                type="button"
                                                variant="danger"
                                                size="sm"
                                                className="position-absolute top-0 end-0 translate-middle rounded-circle p-0"
                                                style={{width: '28px', height: '28px', lineHeight: 1}}
                                                aria-label={`Видалити додаткове фото ${index + 1}`}
                                                onClick={() => removeAdditionalImage(item.signature)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Form.Group>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" type="button" onClick={onHide} disabled={isSubmitting}>
                    Закрити
                </Button>
                <Button variant="outline-success" type="button" onClick={addProduct} disabled={isSubmitting}>
                    {isSubmitting ? 'Додаємо…' : 'Додати'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;
