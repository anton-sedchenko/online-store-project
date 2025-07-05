import React, {useContext} from 'react';
import {Modal} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import ProductsCounter from '../UI/ProductsCounter.jsx';
import {Context} from '../../main.jsx';
import {observer} from 'mobx-react-lite';

const MobileMenuModal = observer(({show, onHide}) => {
    const {userStore} = useContext(Context);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Меню</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="modal__menu">
                    <li>
                        <Link to="/" onClick={onHide}>Галерея</Link>
                    </li>
                    {userStore.isAuth && (
                        <li>
                            <Link to="/profile" onClick={onHide}>Мій профіль</Link>
                        </li>
                    )}
                    <li>
                        <Link to="/cart" onClick={onHide}>Мій кошик <ProductsCounter/></Link>
                    </li>
                    <li>
                        <Link to="/contacts" onClick={onHide}>Контакти</Link>
                    </li>
                </ul>
            </Modal.Body>
        </Modal>
    );
});

export default MobileMenuModal;