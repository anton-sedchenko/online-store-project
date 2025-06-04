import React from 'react';
import {Link, useLocation} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts.js";

const Auth = () => {
    // useLocation - хук в реакт-роутер-дом, дозволяє отримати маршрут в строкі запиту
    // в залежності від запиту рендеримо авторизацію або регістрацію
    const location = useLocation();
    const isLogin = location.pathname === LOGIN_ROUTE;

    return (
        <div style={{height: window.innerHeight - 150, width: "100%"}}>
            <div className="auth__form__container">
                <h2>{isLogin ? "Авторизація" : "Реєстрація"}</h2>
                <form action="" method="get" className="auth__form">
                    <div className="auth__form-email">
                        <input type="email" name="email" id="email" placeholder="Введіть ваш email..." required/>
                    </div>
                    <div className="auth__form-pass">
                        <input type="text" name="password" placeholder="Введіть ваш пароль..." required/>
                    </div>

                        {isLogin ?
                            <div>
                                <p className="auth__form__register__advice">
                                    Немає аккаунту? <Link to={REGISTRATION_ROUTE}>Зареєструйся!</Link>
                                </p>
                            </div>
                            :
                            <div>
                                <p className="auth__form__register__advice">
                                    Є аккаунт? <Link to={LOGIN_ROUTE}>Увійдіть!</Link>
                                </p>
                            </div>
                        }
                    <div className="auth__form-submit">
                        <input type="submit" value={isLogin ? "Увійти" : "Зареєструватися"} />
                    </div>
                </form>
            </div>
        </div>
);
};

export default Auth;