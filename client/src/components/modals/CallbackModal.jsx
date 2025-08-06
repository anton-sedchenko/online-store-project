import React, {useState} from "react";
import {sendCallback} from "../../http/callbackAPI.js";

export default function CallbackModal({show, onHide}) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        if (!name.trim() || !phone.trim()) {
            setError("Ім’я та телефон обов’язкові");
            return;
        }

        try {
            await sendCallback({ name, phone, comment });
            // відмінусуй з поля, закрий модалку
            onClose();
            // опціонально: show toast “Отлично, скоро зателефонуємо”
        } catch (err) {
            setError("Не вдалося відправити. Спробуйте пізніше.");
            console.error(err);
        }
    };

    if (!show) return null;

    return (
        <div className="modal-backdrop show">
            <div className="modal d-block" tabIndex={-1}>
                <div className="modal-dialog">
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Замовити зворотний дзвінок</h5>
                            <button type="button" className="btn-close" onClick={onClose}/>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Ім’я</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Телефон</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Коментар (необов’язково)</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                            </div>
                            {error && <div className="text-danger">{error}</div>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Відмінити
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Замовити дзвінок
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}