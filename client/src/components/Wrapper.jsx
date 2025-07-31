import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Banner from "./Banner.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {HOME_ROUTE, LOGIN_ROUTE} from "../utils/consts.js";

const Wrapper = ({children}) => {
    const location = useLocation();
    const isGallery = location.pathname === HOME_ROUTE;

    return (
        <div className="wrapper">
            <Header />
            <div className="page__content">
                {(isGallery) && <Banner />}
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default Wrapper;
