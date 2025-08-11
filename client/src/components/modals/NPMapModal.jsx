import React, {useEffect, useMemo, useState} from 'react';
import {Modal, Button, Spinner} from 'react-bootstrap';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import {getWarehouses} from '../../http/npAPI.js';

// фіксим дефолтні іконки leaflet у Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const NPMapModal = ({show, onHide, cityRef, type='Branch', onSelect}) => {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);

    useEffect(() => {
        if (!show || !cityRef) return;
        (async () => {
            setLoading(true);
            try {
                const data = await getWarehouses({ cityRef, type });
                setList(data);
            } finally {
                setLoading(false);
            }
        })();
    }, [show, cityRef, type]);

    const center = useMemo(() => {
        const withCoords = list.filter(w => +w.Latitude && +w.Longitude);
        if (withCoords.length) {
            const lat = +withCoords[0].Latitude, lng = +withCoords[0].Longitude;
            return [lat, lng];
        }
        return [50.4501, 30.5234]; // Київ за замовчуванням
    }, [list]);

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Оберіть відділення на мапі</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{height: 520}}>
                {loading ? (
                    <div className="d-flex h-100 align-items-center justify-content-center">
                        <Spinner />
                    </div>
                ) : (
                    <MapContainer center={center} zoom={12} style={{height: '100%', width: '100%'}}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        {list.map(w => {
                            const lat = +w.Latitude, lng = +w.Longitude;
                            if (!lat || !lng) return null;
                            return (
                                <Marker key={w.Ref} position={[lat, lng]}>
                                    <Popup>
                                        <div style={{maxWidth: 240}}>
                                            <div style={{fontWeight: 600, marginBottom: 6}}>
                                                {w.Number ? `№${w.Number} — `: ''}{w.Description}
                                            </div>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => { onSelect?.(w); onHide(); }}
                                            >
                                                Обрати це відділення
                                            </Button>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default NPMapModal;