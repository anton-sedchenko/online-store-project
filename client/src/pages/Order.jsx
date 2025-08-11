import React, {useContext, useEffect, useMemo, useState} from "react";
import {HOME_ROUTE} from "../utils/consts.js";
import {useNavigate} from "react-router-dom";
import {createOrder} from "../http/orderAPI.js";
import {Context} from "../main.jsx";
import OrderConfirm from "../components/modals/OrderConfirm.jsx";
import {Helmet} from "react-helmet-async";
import {searchCities, getWarehouses} from "../http/npAPI.jsx";
import NPMapModal from "../components/modals/NPMapModal.jsx";

const Order = () => {
    const navigate = useNavigate();
    const {userStore, cartStore} = useContext(Context);
    const [showThankYou, setShowThankYou] = useState(false);

    // доставка
    const [deliveryMethod, setDeliveryMethod] = useState('NP_BRANCH'); // 'NP_BRANCH'|'NP_POSTOMAT'|'NP_COURIER'|'UKR_BRANCH'
    const [cityQuery, setCityQuery] = useState('');
    const [cityOptions, setCityOptions] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const [warehouseRef, setWarehouseRef] = useState('');
    const [showMap, setShowMap] = useState(false);

    // стани кур'єра
    const [crStreet, setCrStreet] = useState('');
    const [crHouse, setCrHouse]   = useState('');
    const [crFlat, setCrFlat]     = useState('');

    // укрпошта пока що просто поле
    const [ukrCity, setUkrCity] = useState('');
    const [ukrOffice, setUkrOffice] = useState('');

    useEffect(() => {
        const t = setTimeout(async () => {
            if (!cityQuery) { setCityOptions([]); return; }
            try { setCityOptions(await searchCities(cityQuery)); } catch {}
        }, 250);
        return () => clearTimeout(t);
    }, [cityQuery]);

    useEffect(() => {
        (async () => {
            setWarehouses([]); setWarehouseRef('');
            if (!cityRef) return;
            if (!deliveryMethod.startsWith('NP_')) return;
            try {
                const type = deliveryMethod === 'NP_POSTOMAT' ? 'Postomat' : 'Branch';
                const list = await getWarehouses({cityRef, type});
                setWarehouses(list);
            } catch {}
        })();
    }, [selectedCity, deliveryMethod]);

    const methodLabel = useMemo(() => ({
        NP_BRANCH: 'Самовивіз з відділення Нової Пошти',
        NP_POSTOMAT: 'Самовивіз з поштомату Нової Пошти',
        NP_COURIER: 'Курʼєр Нова Пошта',
        UKR_BRANCH: 'Самовивіз з відділення Укрпошти'
    }), []);

    // УНІВЕРСАЛЬНІ ПОЛЯ ДЛЯ МІСТА
    const cityRef = selectedCity ? (selectedCity.DeliveryCity || selectedCity.Ref) : null;
    const cityLabel = selectedCity
        ? (selectedCity.Present || selectedCity.Description)
        : cityQuery;

    const handleOrderConfirm = async (e) => {
        e.preventDefault();

        if (deliveryMethod.startsWith('NP_') && !cityRef) {
            return alert('Оберіть місто доставки Нової Пошти');
        }
        if ((deliveryMethod==='NP_BRANCH' || deliveryMethod==='NP_POSTOMAT') && !warehouseRef) {
            return alert('Оберіть відділення/поштомат Нової Пошти');
        }
        if (deliveryMethod==='NP_COURIER' && (!cityRef || !crStreet.trim() || !crHouse.trim())) {
            return alert('Вкажіть місто, вулицю та будинок для курʼєрської доставки');
        }
        if (deliveryMethod==='UKR_BRANCH' && (!ukrCity.trim() || !ukrOffice.trim())) {
            return alert('Вкажіть місто та відділення Укрпошти');
        }

        let shipping = null;

        if (deliveryMethod.startsWith('NP_')) {
            const selectedW = warehouses.find(w => w.Ref === warehouseRef);
            const isPostomat = deliveryMethod === 'NP_POSTOMAT';

            // мапа з даних складу (якщо є координати)
            const map = selectedW ? {
                address: selectedW.ShortAddress || selectedW.Description,
                lat: +selectedW.Latitude || undefined,
                lng: +selectedW.Longitude || undefined
            } : undefined;

            if (deliveryMethod === 'NP_COURIER') {
                const addressLine = `${crStreet.trim()}, ${crHouse.trim()}${crFlat ? `, кв. ${crFlat.trim()}` : ''}`;
                shipping = {
                    method: 'Курʼєр',            // важливо! у контролері саме так перевіряється курʼєр
                    service: 'Нова Пошта',
                    city: selectedCity ? {name: cityLabel, ref: cityRef} : undefined,
                    address: addressLine,        // щоб контролер показав адресу в листі/ТГ
                    courier: {                   // плюс структуровано
                        street: crStreet.trim(),
                        house: crHouse.trim(),
                        flat: crFlat.trim() || undefined
                    }
                };
            } else {
                // відділення або поштомат
                shipping = {
                    method: 'Нова Пошта',
                    service: 'Нова Пошта',
                    city: selectedCity ? {name: cityLabel, ref: cityRef} : undefined,
                    branch: (!isPostomat && selectedW) ? {
                        ref: selectedW.Ref,
                        description: selectedW.Description,
                        number: selectedW.Number
                    } : undefined,
                    postomat: (isPostomat && selectedW) ? {
                        ref: selectedW.Ref,
                        description: selectedW.Description,
                        number: selectedW.Number
                    } : undefined,
                    map
                };
            }

        } else if (deliveryMethod === 'UKR_BRANCH') {
            shipping = {
                method: 'Укрпошта',
                service: 'Укрпошта',
                city: {name: ukrCity.trim()},
                address: ukrOffice.trim()
            };
        }

        try {
            await createOrder({
                fullName: e.target.fullName.value,
                tel: e.target.tel.value,
                email: e.target.email.value,
                comments: e.target.comments.value,
                order: cartStore.items,
                shipping
            }, userStore.isAuth);
        } catch {
            return alert("Не вдалося оформити замовлення");
        }

        setShowThankYou(true);
        setTimeout(() => {
            setShowThankYou(false);
            cartStore.clearCart();
            navigate(HOME_ROUTE);
        }, 4000);
    }

    return (
        <>
            <Helmet>
                <title>Оформлення замовлення – Charivna Craft</title>
                <meta name="description" content="Вкажіть дані для доставки й завершення замовлення виробів ручної роботи."/>
            </Helmet>

            <div className="component__container">
                <div className="order__form__container">
                    <h3 className="order__page__title">Оформлення замовлення</h3>
                    <form className="buyer__contacts__form" onSubmit={handleOrderConfirm}>
                        <p>Прізвище ім'я по-батькові<span className="input__label__required__marker">*</span></p>
                        <input required name="fullName" type="text" className="buyer__contacts__form-input" maxLength="50"/>

                        <p>Телефон<span className="input__label__required__marker">*</span></p>
                        <input required name="tel" type="tel" className="buyer__contacts__form-input" maxLength="20"/>

                        <p>E-mail<span className="input__label__required__marker">*</span></p>
                        <input required name="email" type="email" className="buyer__contacts__form-input" maxLength="50"/>

                        <h4 style={{marginTop:20}}>Доставка</h4>
                        <div className="shipping__methods">
                            <label className="radio">
                                <input type="radio" checked={deliveryMethod==='NP_BRANCH'} onChange={()=>setDeliveryMethod('NP_BRANCH')}/>
                                Самовивіз з відділення Нової Пошти <span className="muted">— за тарифами перевізника</span>
                            </label>
                            <label className="radio">
                                <input type="radio" checked={deliveryMethod==='NP_POSTOMAT'} onChange={()=>setDeliveryMethod('NP_POSTOMAT')}/>
                                Самовивіз з поштомату Нової Пошти <span className="muted">— за тарифами перевізника</span>
                            </label>
                            <label className="radio">
                                <input type="radio" checked={deliveryMethod==='NP_COURIER'} onChange={()=>setDeliveryMethod('NP_COURIER')}/>
                                Курʼєр Нова Пошта <span className="muted">— за тарифами перевізника</span>
                            </label>
                            <label className="radio">
                                <input type="radio" checked={deliveryMethod==='UKR_BRANCH'} onChange={()=>setDeliveryMethod('UKR_BRANCH')}/>
                                Самовивіз з відділення Укрпошти <span className="muted">— за тарифами перевізника</span>
                            </label>
                        </div>

                        {deliveryMethod.startsWith('NP_') && (
                            <>
                                <p style={{marginTop:12}}>Місто</p>
                                <input
                                    type="text"
                                    className="buyer__contacts__form-input"
                                    placeholder="Почніть вводити місто…"
                                    value={cityLabel}
                                    onChange={(e)=>{setSelectedCity(null); setCityQuery(e.target.value);}}
                                />
                                {(!selectedCity && cityOptions.length > 0) && (
                                    <div className="dropdown-list">
                                        {cityOptions.map(c=>(
                                            <div
                                                key={c.DeliveryCity || c.Ref}
                                                className="dropdown-item"
                                                onClick={() => {setSelectedCity(c); setCityOptions([]);}}
                                            >
                                                {c.Present || c.Description}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* >>> COURIER FIELDS START — показуємо тільки для NP_COURIER */}
                                {deliveryMethod === 'NP_COURIER' && selectedCity && (
                                    <>
                                        <p style={{marginTop:12}}>Вулиця</p>
                                        <input
                                            className="buyer__contacts__form-input"
                                            value={crStreet}
                                            onChange={e=>setCrStreet(e.target.value)}
                                            placeholder="Наприклад, Тараса Шевченка"
                                        />

                                        <div style={{display:'flex', gap:8, marginTop:12}}>
                                            <div style={{flex:1}}>
                                                <p>Будинок</p>
                                                <input
                                                    className="buyer__contacts__form-input"
                                                    value={crHouse}
                                                    onChange={e=>setCrHouse(e.target.value)}
                                                    placeholder="№"
                                                />
                                            </div>
                                            <div style={{flex:1}}>
                                                <p>Квартира (необовʼязково)</p>
                                                <input
                                                    className="buyer__contacts__form-input"
                                                    value={crFlat}
                                                    onChange={e=>setCrFlat(e.target.value)}
                                                    placeholder="№"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {/* <<< COURIER FIELDS END */}

                                {(deliveryMethod==='NP_BRANCH' || deliveryMethod==='NP_POSTOMAT') && selectedCity && (
                                    <>
                                        <p style={{marginTop:12}}>Відділення / Поштомат</p>
                                        <div style={{display:'flex', gap:8}}>
                                            <select
                                                className="buyer__contacts__form-input"
                                                style={{flex:1}}
                                                value={warehouseRef}
                                                onChange={e=>setWarehouseRef(e.target.value)}
                                            >
                                                <option value="">Оберіть відділення…</option>
                                                {warehouses.map(w=>(
                                                    <option key={w.Ref} value={w.Ref}>
                                                        {w.Number ? `№${w.Number} — `: ''}{w.Description}
                                                    </option>
                                                ))}
                                            </select>
                                            <button type="button" className="neu-btn" onClick={()=>setShowMap(true)}>
                                                Обрати на мапі
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {deliveryMethod==='UKR_BRANCH' && (
                            <>
                                <p style={{marginTop:12}}>Місто (Укрпошта)</p>
                                <input className="buyer__contacts__form-input" value={ukrCity} onChange={e=>setUkrCity(e.target.value)} />
                                <p style={{marginTop:12}}>Відділення (Укрпошта)</p>
                                <input className="buyer__contacts__form-input" value={ukrOffice} onChange={e=>setUkrOffice(e.target.value)} />
                            </>
                        )}

                        <p style={{marginTop:16}}>Коментар до замовлення</p>
                        <input name="comments" type="text" className="buyer__contacts__form-input" maxLength="200"/>

                        <div className="order__form__btn__container">
                            <button className="order__form__confirm__btn" type="submit">Підтвердити замовлення</button>
                            <button className="order__form__return__btn" type="button" onClick={()=>navigate(HOME_ROUTE)}>
                                Повернутись до галереї
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Модалка карти НП */}
            <NPMapModal
                show={showMap}
                onHide={()=>setShowMap(false)}
                cityRef={cityRef}
                type={deliveryMethod==='NP_POSTOMAT' ? 'Postomat' : 'Branch'}
                onSelect={w => setWarehouseRef(w.Ref)}
            />

            <OrderConfirm show={showThankYou} onHide={()=>setShowThankYou(false)} />
        </>
    );
};

export default Order;