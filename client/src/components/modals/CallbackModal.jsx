import React, { useState, useEffect } from "react";
import { sendCallback } from "../../http/callbackAPI.js";

export default function CallbackModal({ show, onClose }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Якщо на кнопку не закрили, то закрити через три секунди
    useEffect(() => {
        if (!submitted) return;

        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [submitted, onClose]);

    // Якщо модалка відкрилась заново — очищаємо все
    useEffect(() => {
        if (show) {
            setName("");
            setPhone("");
            setComment("");
            setError("");
            setSubmitted(false);
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!name.trim() || !phone.trim()) {
            setError("Ім’я та телефон обов’язкові");
            return;
        }

        try {
            await sendCallback({ name, phone, comment });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError("Не вдалося відправити. Спробуйте пізніше.");
        }
    };

    if (!show) return null;

    return (
        <div className="modal-backdrop show">
            <div className="modal d-block" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                {submitted
                                    ? "Дякуємо!"
                                    : "Замовити зворотний дзвінок"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            />
                        </div>

                        {submitted ? (
                            <>
                                <div className="modal-body">
                                    <p>Дякуємо! Очікуйте на дзвінок.</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={onClose}
                                    >
                                        Закрити
                                    </button>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Ім’я</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Телефон</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Коментар (необов’язково)
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </div>
                                    {error && (
                                        <div className="text-danger mb-2">{error}</div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={onClose}
                                    >
                                        Відмінити
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Замовити дзвінок
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}