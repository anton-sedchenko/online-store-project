import React, {useContext, useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter.jsx";
import Wrapper from "./components/Wrapper.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import {observer} from "mobx-react-lite";
import {Context} from "./main.jsx";
import {Spinner} from "react-bootstrap";

const App = observer(() => {
    const {user} = useContext(Context);
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

        user.checkAuth()
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user]);

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
