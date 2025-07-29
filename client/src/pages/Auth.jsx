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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const click = async () => {
        try {
            let tokenUser;
            if (isLogin) {
                await login(email, password); // лише зберігає токен
            } else {
                await registration(email, password);
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
                        <div className="auth__form-pass">
                            <input
                                className="neu-input"
                                type="password"
                                name="password"
                                placeholder="Введіть ваш пароль..."
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
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
                            className="neu-btn auth__action__btn"
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