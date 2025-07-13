import React, {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {resetPassword} from '../http/userAPI';

const ResetPassword = () => {
    const {token} = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await resetPassword(token, password);
            setMessage(response.message || 'Пароль змінено');
            setTimeout(() => navigate('/login'), 2000);
        } catch (e) {
            setMessage(e.response?.data?.message || e.message);
        }
    };

    return (
        <div className="component__container">
            <div className="component__container" style={{padding: 20}}>
                <h2>Новий пароль</h2>
                <form onSubmit={handleSubmit} className="auth__form">
                    <input
                        className="neu-input"
                        type="password"
                        placeholder="Введіть новий пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button className="neu-btn" type="submit">
                        Змінити пароль
                    </button>
                    {message && <p style={{marginTop: 10}}>{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;