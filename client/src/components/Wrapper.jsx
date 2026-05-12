import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import {useLocation} from "react-router-dom";
import ScrollToTop from "./ScrollToTop.js";
import SeoBlock from "./SeoBlock.jsx";

const Wrapper = ({children}) => {
    const location = useLocation();

    const isHomePage = location.pathname === "/";

    return (
        <div className="wrapper">
            <Header />
            <ScrollToTop />
            <div className="page__content pt-1">
                {children}
                {isHomePage && <SeoBlock />}
            </div>
            <Footer />
        </div>
    );
};

export default Wrapper;