import React, {useContext, useEffect} from 'react';
import {Modal, Button} from 'react-bootstrap';
import {observer} from 'mobx-react-lite';
import {Context} from '../../main.jsx';
import {fetchTypes} from '../../http/typeAPI.js';

const MobileTypeModal = observer(({show, onHide}) => {
    const {productStore} = useContext(Context);

    useEffect(() => {
        fetchTypes().then(data => productStore.setTypes(data));
    }, []);

    const selectType = (type) => {
        productStore.setSelectedType(type);
        onHide(); // закриваємо після вибору
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Обрати категорію</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-wrap gap-2">
                    {productStore.types.map(type => (
                        <Button
                            key={type.id}
                            variant={type.id === productStore.selectedType.id ? 'primary' : 'outline-secondary'}
                            onClick={() => selectType(type)}
                        >
                            {type.name}
                        </Button>
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default MobileTypeModal;