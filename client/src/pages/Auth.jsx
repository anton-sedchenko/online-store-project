import React, {useContext, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {FORGOT_PASSWORD_ROUTE, LOGIN_ROUTE, HOME_ROUTE, REGISTRATION_ROUTE} from "../utils/consts.js";
import {fetchAuthUser, login, registration} from "../http/userAPI.js";
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {Helmet} from "react-helmet-async";

const Auth = observer(() => {
    const {userStore, cartStore} = useContext(Context);
    // useLocation - хук в реакт-роутер-дом, дозволяє отримати маршрут в строкі запиту
    // в залежності від запиту рендеримо авторизацію або регістрацію
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const click = async () => {
        try {
            let tokenUser;
            if (isLogin) {
                await login(email, password); // Лише зберігає токен
            } else {
                if (!name.trim()) {
                    return alert("Будь ласка, вкажіть ім'я.");
                }
                await registration(email, password, name.trim());
            }

            tokenUser = await fetchAuthUser(); // отримуємо юзера з БД
            userStore.setUser(tokenUser);
            userStore.setIsAuth(true);
            await cartStore.switchToAuth();
            navigate(HOME_ROUTE);
        } catch (e) {
            alert(e.response?.data?.message || e.message);
        }
    };

    return (
        <>
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div
                className="component__container"
                style={{height: window.innerHeight - 150, width: "100%"}}
            >
                <div className="auth__form__container">
                    <h2>{isLogin ? "Авторизація" : "Реєстрація"}</h2>
                    <form className="auth__form">
                        {!isLogin && (
                            <div className="auth__form-name">
                                <input
                                    className="neu-input"
                                    type="text"
                                    name="name"
                                    placeholder="Введіть ваше ім'я..."
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-email">
                            <input
                                className="neu-input"
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Введіть ваш email..."
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth__form-pass password-field">
                            <input
                                className="neu-input"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Введіть ваш пароль..."
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete={isLogin ? "current-password" : "new-password"}
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(v => !v)}
                                aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
                                title={showPassword ? "Сховати пароль" : "Показати пароль"}
                            >
                                {showPassword ? (
                                    // eye-off
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8
                                                1.06-3.05 3.04-5.41 5.6-6.74"/>
                                        <path d="M1 1l22 22"/>
                                        <path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5
                                                3.5 3.5 0 0 0 14.47 14.47"/>
                                        <path d="M14.47 9.53A3.5 3.5 0 0 0 12 8.5"/>
                                        <path d="M17.94 6.06A10.94 10.94 0 0 1 23 12
                                                c-.73 2.1-1.95 3.93-3.56 5.3"/>
                                    </svg>
                                ) : (
                                    // eye
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>

                            {isLogin ?
                                <div>
                                    <p className="auth__form__register__advice">
                                        Немає аккаунту? <Link to={REGISTRATION_ROUTE}>Зареєструйся!</Link>
                                    </p>
                                    <p className="auth__form__register__advice">
                                        <Link to={FORGOT_PASSWORD_ROUTE}>Забули пароль?</Link>
                                    </p>
                                </div>
                                :
                                <div>
                                    <p className="auth__form__register__advice">
                                        Є аккаунт? <Link to={LOGIN_ROUTE}>Увійдіть!</Link>
                                    </p>
                                </div>
                            }
                        <button
                            className="auth__action__btn"
                            type="button"
                            onClick={click}
                        >
                            {isLogin ? "Увійти" : "Зареєструватися"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
});

export default Auth;