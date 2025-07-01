/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {authRoutes, publicRoutes} from "../routes.js";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";

const AppRouter = observer(() => {
    const {userStore} = useContext(Context);

    return (
        <Routes>
            {userStore.isAuth && authRoutes.map(({path, Component}) => (
                <Route
                    key={path}
                    path={path}
                    element={<Component/>}
                />
            ))}

            {publicRoutes.map(({path, Component}) => (
                // eslint-disable-next-line no-unused-vars
                <Route
                    key={path}
                    path={path}
                    element={<Component/>}
                />
            ))}

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
});

export default AppRouter;
