import React, {useEffect, useMemo, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createProduct} from "../../http/productAPI.js";
import {fetchTypes} from "../../http/typeAPI.js";
import {observer} from "mobx-react-lite";
import {
    getRozetkaParamNames,
    getRozetkaParamValues,
    getRozetkaParamsForCategory,
} from "../../utils/rozetkaParams.js";

const KIND_OPTIONS = ['Кошик', 'Плейсмат', 'Костер', 'Кашпо', 'Набір'];
const MATERIAL_OPTIONS = ['Бавовна'];
const COLOR_OPTIONS = ['Айворі', 'Світло-сірий', 'Зелений', 'Чорний', 'Червоний', 'Коричневий', 'Комбінований'];
const SHAPE_OPTIONS = ['Кругла', 'Овальна', 'Прямокутна'];
const PURPOSE_OPTIONS = ['Для ванної', 'Для кухні', 'Для зберігання', 'Універсальне', 'Декоративне'];
const FEATURE_OPTIONS = ['З кришкою', 'З ручками', 'Плетений', 'Набір'];

const emptyMarketplaceParam = {marketplace: 'rozetka', name: '', value: ''};

const CreateProduct = observer(({show, onHide}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [descr, setDescr] = useState('');
    const [color, setColor] = useState('');
    const [kind, setKind] = useState('');
    const [shape, setShape] = useState('');
    const [purpose, setPurpose] = useState('');
    const [features, setFeatures] = useState([]);
    const [file, setFile] = useState(null);
    const [code, setCode] = useState('');
    const [availability, setAvailability] = useState('IN_STOCK');
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
    const rozetkaConfig = useMemo(() => getRozetkaParamsForCategory(rozetkaCategoryId), [rozetkaCategoryId]);
    const rozetkaParamNames = useMemo(() => getRozetkaParamNames(rozetkaCategoryId), [rozetkaCategoryId]);

    const resetForm = () => {
        setName('');
        setPrice(0);
        setDescr('');
        setColor('');
        setKind('');
        setShape('');
        setPurpose('');
        setFeatures([]);
        setFile(null);
        setCode('');
        setAvailability('IN_STOCK');
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

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFeaturesChange = (e) => {
        const values = Array.from(e.target.selectedOptions).map(option => option.value);
        setFeatures(values);
    };

    const addMarketplaceParam = () => {
        setMarketplaceParams(prev => [...prev, {...emptyMarketplaceParam}]);
    };

    const removeMarketplaceParam = (index) => {
        setMarketplaceParams(prev => prev.filter((_, itemIndex) => itemIndex !== index));
    };

    const updateMarketplaceParam = (index, field, value) => {
        setMarketplaceParams(prev => prev.map((item, itemIndex) => {
            if (itemIndex !== index) return item;

            if (field === 'name') {
                return {
                    ...item,
                    name: value,
                    value: '',
                };
            }

            return {
                ...item,
                [field]: value,
            };
        }));
    };

    const addDefaultRozetkaRows = () => {
        const names = getRozetkaParamNames(rozetkaCategoryId);
        const defaults = names.map(paramName => ({
            marketplace: 'rozetka',
            name: paramName,
            value: '',
        }));
        setMarketplaceParams(defaults);
    };

    const getPreparedMarketplaceParams = () => {
        return marketplaceParams
            .map(item => ({
                marketplace: 'rozetka',
                name: String(item.name || '').trim(),
                value: String(item.value || '').trim(),
            }))
            .filter(item => item.name && item.value);
    };

    const addProduct = async () => {
        if (!file) {
            alert("Додайте зображення товару");
            return;
        }

        if (!typeId) {
            alert("Оберіть категорію товару");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", `${price}`);
            formData.append("typeId", typeId);
            formData.append("description", descr || "");
            formData.append("img", file);
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
            formData.append("marketplaceParams", JSON.stringify(getPreparedMarketplaceParams()));

            await createProduct(formData);
            resetForm();
            onHide();
        } catch (e) {
            alert(e.response?.data?.message || e.message);
        }
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
                        <Form.Label>ID категорії Rozetka (необов’язково)</Form.Label>
                        <Form.Control
                            type="number"
                            inputMode="numeric"
                            placeholder="Наприклад: 4652688"
                            value={rozetkaCategoryId}
                            onChange={e => {
                                setRozetkaCategoryId(e.target.value);
                                setMarketplaceParams([]);
                            }}
                        />
                    </Form.Group>

                    <div className="border rounded p-3 mb-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <strong>Характеристики для Rozetka</strong>
                                <div className="text-muted small">
                                    Ці поля йдуть тільки в rozetka.xml і не впливають на фільтри сайту.
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    type="button"
                                    disabled={!rozetkaConfig}
                                    onClick={addDefaultRozetkaRows}
                                >
                                    Додати шаблон
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    type="button"
                                    disabled={!rozetkaConfig}
                                    onClick={addMarketplaceParam}
                                >
                                    + Рядок
                                </Button>
                            </div>
                        </div>

                        {!rozetkaCategoryId && (
                            <Form.Text muted>Спочатку вкажіть ID категорії Rozetka.</Form.Text>
                        )}

                        {rozetkaCategoryId && !rozetkaConfig && (
                            <Form.Text className="text-danger">
                                Для цієї категорії ще немає локального довідника значень.
                            </Form.Text>
                        )}

                        {marketplaceParams.map((item, index) => {
                            const values = getRozetkaParamValues(rozetkaCategoryId, item.name);
                            const hasPresetValues = values.length > 0;

                            return (
                                <div key={`${index}-${item.name}`} className="d-flex gap-2 mb-2 align-items-start">
                                    <Form.Select
                                        value={item.name}
                                        onChange={e => updateMarketplaceParam(index, 'name', e.target.value)}
                                    >
                                        <option value="">Характеристика</option>
                                        {rozetkaParamNames.map(paramName => (
                                            <option key={paramName} value={paramName}>{paramName}</option>
                                        ))}
                                    </Form.Select>

                                    {hasPresetValues ? (
                                        <Form.Select
                                            value={item.value}
                                            onChange={e => updateMarketplaceParam(index, 'value', e.target.value)}
                                        >
                                            <option value="">Значення</option>
                                            {values.map(value => (
                                                <option key={value} value={value}>{value}</option>
                                            ))}
                                        </Form.Select>
                                    ) : (
                                        <Form.Control
                                            value={item.value}
                                            placeholder="Значення з довідника Rozetka"
                                            onChange={e => updateMarketplaceParam(index, 'value', e.target.value)}
                                        />
                                    )}

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        type="button"
                                        onClick={() => removeMarketplaceParam(index)}
                                    >
                                        ×
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

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
                            <option value="IN_STOCK">В наявності</option>
                            <option value="MADE_TO_ORDER">Під замовлення (2–3 дні)</option>
                            <option value="OUT_OF_STOCK">Немає в наявності</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Тип виробу</Form.Label>
                        <Form.Select value={kind} onChange={e => setKind(e.target.value)}>
                            <option value="">Оберіть тип</option>
                            {KIND_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Колір</Form.Label>
                        <Form.Select value={color} onChange={e => setColor(e.target.value)}>
                            <option value="">Оберіть колір</option>
                            {COLOR_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Матеріал</Form.Label>
                        <Form.Select value={material} onChange={e => setMaterial(e.target.value)}>
                            <option value="">Оберіть матеріал</option>
                            {MATERIAL_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Форма</Form.Label>
                        <Form.Select value={shape} onChange={e => setShape(e.target.value)}>
                            <option value="">Оберіть форму</option>
                            {SHAPE_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Призначення</Form.Label>
                        <Form.Select value={purpose} onChange={e => setPurpose(e.target.value)}>
                            <option value="">Оберіть призначення</option>
                            {PURPOSE_OPTIONS.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Особливості</Form.Label>
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
                        <Form.Label>Розміри (см)</Form.Label>
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

                    <Form.Control
                        type="file"
                        className="modal__input"
                        onChange={selectFile}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрити
                </Button>
                <Button variant="outline-success" onClick={addProduct}>
                    Додати
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;
