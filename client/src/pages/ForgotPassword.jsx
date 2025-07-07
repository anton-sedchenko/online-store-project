import React, {useState} from 'react';
import {requestPasswordReset} from '../http/userAPI';
import {useNavigate} from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await requestPasswordReset(email);
            setMessage(response.message || 'Інструкції надіслано');
        } catch (e) {
            setMessage(e.response?.data?.message || e.message);
        }
    };

    return (
        <div className="component__container" style={{padding: 20}}>
            <h2>Відновлення паролю</h2>
            <form onSubmit={handleSubmit} className="auth__form">
                <input
                    className="neu-input"
                    type="email"
                    placeholder="Введіть ваш email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <button className="neu-btn" type="submit">
                    Надіслати посилання
                </button>
                {message && <p style={{marginTop: 10}}>{message}</p>}
            </form>
        </div>
    );
};

export default ForgotPassword;