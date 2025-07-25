import React, {useContext, useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter.jsx";
import Wrapper from "./components/Wrapper.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.scss";
import {observer} from "mobx-react-lite";
import {Context} from "./main.jsx";
import {Spinner} from "react-bootstrap";
import {fetchAuthUser} from "./http/userAPI.js";

const App = observer(() => {
    const {userStore, cartStore} = useContext(Context);
    const [loading, setLoading] = useState(true);

    // При першому запуску додатку відправити один запит, коли отримали відповідь - вимкнути крутилку.
    // Якщо масив залежностей порожній, то функція відпрацює тільки один раз.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            // якщо токена немає - зупиняємо лоадер
            setLoading(false);
            return;
        }

        // Оновлюємо user і завантажуємо його кошик
        fetchAuthUser()
            .then(me => userStore.setUser(me))
            .then(() => userStore.setIsAuth(true))
            .then(() => cartStore.switchToAuth())
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Spinner animation={"grow"}/>
    }

    return (
        <BrowserRouter>
            <Wrapper>
                <AppRouter />
            </Wrapper>
        </BrowserRouter>
    );
});

export default App
